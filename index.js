#!/usr/bin/env node
"use strict";

//    EXTERNAL DEPENDENCIES
const fs                = require("fs"),
      iq                = require("inquirer"),
      octonode          = require("octonode"),
      gitLabel          = require("git-label");
//    UTILS ARE STANDALONE METHODS WITH NO DEPENDENCIES
const alertDeletes      = require("./utils/alertDeletes"),
      banner            = require("./utils/banners"),
      configGitLabel    = require("./utils/configGitLabel"),
      removeAll         = require("./utils/removeAll"),
      validateRemovals  = require("./utils/validateRemovals");
//    PROMPTS ARE THE PROMPTS ARRAYS FOR VARIOUS QUESTIONS
const prompts           = {
        addCustom:        require("./prompts/addCustom"),
        deleteConfirm:    require("./prompts/deleteConfirm"),
        mainMenu:         require("./prompts/mainMenu")
      };
//    MODULES ARE UTILS WITH DEPENDENCIES
const readRepo          = require("./modules/readRepo"),
      setToken          = require("./modules/setToken"),
      fetchToken        = require("./modules/fetchToken"),
      isGitRepo         = require("./modules/isGitRepo"),
      readGitConfig     = require("./modules/readGitConfig"),
      requestLabels     = require("./modules/requestLabels");


/////reset the token fn
const resetToken = () => {
  banner.resetToken();
  return setToken(gitLabelmaker);
};
/////add custom labels fn
const addCustom = (repo, token) => {
  banner.addCustom();
  return doCustomLabelPrompts( [], (newLabels) => {
    gitLabel.add( configGitLabel(repo, token), newLabels )
      .then(console.log)
      .catch(console.warn);
  });
};
/////add labels from package
const addFromPackage = (repo, token, path) => {
  gitLabel.find( removeAll( path, [ "`", '"', "'" ] ) )
    .then((newLabels)=>{
      return gitLabel.add( configGitLabel(repo, token), newLabels )
    })
    .then(console.log)
    .catch(console.warn);
};
/////

//  Recursivly asks if you want to add another new label, then calls a callback when youre all done
const doCustomLabelPrompts = ( newLabels, done ) => {
        iq.prompt( prompts.addCustom, ( answers ) => {
          newLabels.push({ name: answers.labelName, color: answers.labelColor });
          if ( answers.addAnother ){
            doCustomLabelPrompts( newLabels, done );
          }else{
            done( newLabels );
          }
        });
      };

//    TODO: could be refactored to return the git.add as a promise..?
const handleAddPrompts = (repo, token, newLabels) => {
        gitLabel.add( configGitLabel(repo, token), newLabels )
          .then(console.log)
          .catch(console.warn);
      };

//    TODO: refactor into some kind of switch statement?
const handleMainPrompts = (repo, token, ans) => {
        if ( ans.main.toLowerCase() === "reset token" ){
          resetToken();
        }
        if ( ans.main.toLowerCase() === "add custom labels" ){
          addCustom(repo, token);
        }
        if ( ans.main.toLowerCase() === "add labels from package" ){
          banner.addFromPackage();
          let packagePath;
          iq.prompt([{
            name: "path",
            type: "input",
            message: "What is the path & name of the package you want to use? (eg: `packages/my-label-pkg.json`)",
            validate: (path) => {
              try {
                if (path.indexOf(".json") < 0) throw "Not a JSON file";
                packagePath = path.indexOf("/") === 0 ? path.replace("/","") : path;
                packagePath = removeAll( packagePath, [ "`", '"', "'" ] );
                if ( fs.statSync( process.cwd()+"/"+packagePath ) ){
                  return true;
                }
              } catch (e){
                return e;
              }
            }
          }], (ans) => {
            addFromPackage( repo, token, ans.path );
          });
        }
        if ( ans.main.toLowerCase() === "remove labels" ){
          banner.removeLabels();
          requestLabels(repo, token)
            .then((body)=>{
              iq.prompt([{
                name:     "removals",
                type:     "checkbox",
                message:  "Which labels would you like to remove?",
                choices:  body.map((label) => label.name),
                validate: validateRemovals,
                filter:   (removals) => {
                  return body.filter((label) => {
                    return removals.indexOf(label.name) > -1 ? { name: label.name, color: label.color } : false;
                  });
                }
              }], (answers) => {
                //  Tell the user what they're about to lose
                console.log("About to delete the following labels:")
                alertDeletes();// alerts the list of labels to be removed

                //  Ya sure ya wanna do this bud?
                iq.prompt([prompts.deleteConfirm], (confirmRemove) => {
                  if ( confirmRemove.youSure ) {
                    gitLabel.remove( configGitLabel(repo, token), answers.removals )
                      .then(console.log)
                      .catch(console.warn);
                  } else {
                    gitLabelmaker();
                  }
                })
              });
            })
            .catch(console.warn);
        }
      };



//    Kicks things off and arrows program to
const gitLabelmaker = () => {
  //  Checks for three things at once, each will return a nice error obj if they fail
  Promise.all([ isGitRepo(), readGitConfig(), fetchToken() ])
    .then(( values )=>{
      let repo = readRepo(values[1]);
      let token = values[2];
      banner.welcome();
      iq.prompt( prompts.mainMenu, handleMainPrompts.bind(null, repo, token));
    })
    .catch((e)=>{
      console.warn(e.err);
      if (e.id === "TOKEN") {
        setToken(gitLabelmaker);
      } else {
        process.exit(1);
      }
    });
};

gitLabelmaker();

////////////////////
//  CODE GRAVEYARD
/////////////////////
//    A simple prompt util, returns a promise with the prompt answers
///   NOT IN USE
const prompt = (prompts) => {
        return new Promise((res, rej)=>{
          iq.prompt(prompts, (answers) => {
            if ( !answers ) rej(answers);
            res(answers);
          });
        });
      };
