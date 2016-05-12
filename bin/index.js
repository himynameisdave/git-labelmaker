#!/usr/bin/env node
"use strict";

//    EXTERNAL DEPENDENCIES
const fs                   = require("fs"),
      iq                   = require("inquirer"),
      gitLabel             = require("git-label");
//    UTILS ARE STANDALONE METHODS WITH NO DEPENDENCIES
const alertDeletes         = require("./utils/alertDeletes"),
      banner               = require("./utils/banners"),
      configGitLabel       = require("./utils/configGitLabel"),
      filterRemovalLabels  = require("./utils/filterRemovalLabels"),
      removeAllFromStr     = require("./utils/removeAllFromStr"),
      validateRemovals     = require("./utils/validateRemovals");
//    PROMPTS ARE THE PROMPTS ARRAYS FOR VARIOUS QUESTIONS
const prompts              = {
        addCustom:           require("./prompts/addCustom"),
        deleteConfirm:       require("./prompts/deleteConfirm"),
        mainMenu:            require("./prompts/mainMenu")
      };
//    MODULES ARE UTILS WITH DEPENDENCIES
const convertRGBToHex      = require("./modules/convertRGBToHex"),
      doCustomLabelPrompts = require("./modules/doCustomLabelPrompts")(prompts.addCustom),
      readRepo             = require("./modules/readRepo"),
      setToken             = require("./modules/setToken"),
      fetchToken           = require("./modules/fetchToken"),
      isGitRepo            = require("./modules/isGitRepo"),
      readGitConfig        = require("./modules/readGitConfig"),
      requestLabels        = require("./modules/requestLabels"),
      prompt               = require("./modules/prompt"),
      validateAddPackages  = require("./modules/validateAddPackages");

//    Kicks things off, named so that it can be called at any time
//    The params will sometimes come thru if we've just set the token, so if we got them we alter the call a lil...
const gitLabelmaker = (token) => {
  Promise.all([ isGitRepo(), readGitConfig(), fetchToken(token) ])
    .then(( values )=>{
      let _repo = readRepo(values[1]);
      let _token = values[2];
      banner.welcome();
      iq.prompt( prompts.mainMenu, handleMainPrompts.bind(null, _repo, _token));
    })
    .catch((e)=>{
      switch (e.id) {
        case "TOKEN":
          return setToken(gitLabelmaker);
          break;
        case "QUIT":
          banner.seeYa();
          return process.exit(0);
          break;
        case "PASSWORD":
          banner.wrongPassword();
          return gitLabelmaker();
          break;

        default:
          console.warn(e);
          process.exit(1);
      }
    });
  };

//    resetToken function
const resetToken = () => {
  banner.resetToken();
  return setToken(gitLabelmaker);
};

//    addCustom labels function
const addCustom = (repo, token) => {
  banner.addCustom();
  return doCustomLabelPrompts( [], (newLabels) => {
    let hexedLabels = newLabels.map((newLabel) => {
      if (newLabel.color.indexOf(",") > -1){
        try {
          newLabel.color = convertRGBToHex(newLabel.color);
        }
        catch(e){
          //  graceful quit if one of the values isn't actually rgb;
          console.log(e);
          gitLabelmaker(token);
        }
      }
      return newLabel;
    }).map((newLabel)=>{
      newLabel.color = "#"+newLabel.color;
      return newLabel;
    });
    gitLabel.add( configGitLabel(repo, token), newLabels )
      .then(console.log)
      .catch(console.warn);
  });
};

//    addFromPackage function
const addFromPackage = (repo, token, path) => {
  gitLabel.find( removeAllFromStr( path, [ "`", '"', "'" ] ) )
    .then((newLabels)=>{
      return gitLabel.add( configGitLabel(repo, token), newLabels );
    })
    .then(console.log)
    .catch(console.warn);
};

//    removeLabels function
const removeLabels = (repo, token, answers) => {
  //  Tell the user what they're about to lose
  console.log("About to delete the following labels:");
  alertDeletes(answers.removals);// alerts the list of labels to be removed
  //  Ya sure ya wanna do this bud?
  prompt(prompts.deleteConfirm)
    .then((confirmRemove)=>{
      if ( confirmRemove.youSure ) {
        return gitLabel.remove( configGitLabel(repo, token), answers.removals );
      }
      gitLabelmaker();
    })
    .then(console.log)
    .catch(console.warn);
};

//    Callback for the main prompts, handles program flow
const handleMainPrompts = (repo, token, ans) => {
  switch ( ans.main.toLowerCase() ) {
    case "quit":
      banner.seeYa();
      process.exit(1);
      break;

    case "reset token":
      resetToken();
      break;

    case "add custom labels":
      addCustom(repo, token);
      break;

    case "add labels from package":
      banner.addFromPackage();
      prompt([{
        name:    "path",
        type:    "input",
        message: "What is the path & name of the package you want to use? (eg: `packages/my-label-pkg.json`)",
        validate: validateAddPackages
      }])
      .then((ans)=>{
        return addFromPackage( repo, token, ans.path );
      })
      .catch(console.warn);
      break;

    case "create a package from labels":
      banner.createPkgFromLabels();
      let labelPkg = [];
      requestLabels(repo, token)
        .then((labels)=>{
          if ( labels.length <= 0 ) return new Error("This repo has no labels to generate a package with!");
          //  tell the user what labels we are going to remove
          console.log("Creating a labels package from these labels:");
          labelPkg = labels.map((label)=>{
            console.log(" - "+label.name);
            return { name: label.name, color: "#"+label.color };
          });
          return prompt([{
            name:    "name",
            type:    "input",
            message: "What would you like to name this .json file?",
            default: "labels.json"
          }]);
        })
        .then((ans)=>{
          if (ans.name.indexOf(".json") < 0){
            ans.name = ans.name + ".json";
          }
          fs.writeFile( ans.name, JSON.stringify(labelPkg, null, 2), (e) => {
            if (e) throw e;
            console.log("Saved labels as "+ans.name);
            gitLabelmaker(token);
          })
        })
        .catch(console.warn);
      break;

    case "remove labels":
      banner.removeLabels();
      //  If there are no labels to be removed then we can skip this part
      requestLabels(repo, token)
        .then((labels)=>{
          if ( labels.length <= 0 ) return new Error("This repo has no labels to remove!");
          return prompt([{
            name:     "removals",
            type:     "checkbox",
            message:  "Which labels would you like to remove?",
            choices:  labels.map((label) => label.name),
            validate: validateRemovals,
            filter:   filterRemovalLabels.bind(null, labels)
          }]);
        })
        .then((answers)=>{
          if (answers.removals){
            return removeLabels(repo, token, answers);
          }
          console.log(answers);
        })
        .catch(console.warn);
      break;

    case "remove all labels":
      banner.removeAllLabels();
      requestLabels(repo, token)
        .then((labels)=>{
          if (labels.length !== 0) {
            removeLabels(repo, token, {
              removals: labels
            });
          } else {
            console.log("No labels to remove.");
          }
        })
        .catch(console.warn);
      break;

    default:
      gitLabelmaker();
  }
};

//  Begin our application
gitLabelmaker();
