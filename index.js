#!/usr/bin/env node
"use strict";

//    EXTERNAL DEPENDENCIES
const fs                = require("fs"),
      iq                = require("inquirer"),
      octonode          = require("octonode"),
      gitLabel          = require("git-label");

//    UTILS ARE STANDALONE METHODS WITH NO DEPENDENCIES
const replaceAll        = require("./utils/replaceAll"),
      banner            = require("./utils/banners");

//    PROMPTS ARE THE PROMPTS ARRAYS FOR VARIOUS QUESTIONS
const prompts           = {
        addCustom:        require("./prompts/addCustom"),
        mainMenu:         require("./prompts/mainMenu")
      };

// //    MODULES ARE UTILS WITH DEPENDENCIES
const readRepo          = require("./modules/readRepo"),
      setToken          = require("./modules/setToken"),
      fetchToken        = require("./modules/fetchToken");



//    A simple prompt util, returns a promise with the prompt answers
const prompt = (prompts) => {
        return new Promise((res, rej)=>{
          iq.prompt(prompts, (answers) => {
            if ( !answers ) rej(answers);
            res(answers);
          });
        });
      };

//    A simple util that promisifies our GitHub API call
///   NOT IN USE
const requestLabels = ( token, repo ) => {
        return new Promise((res, rej)=>{
          octonode.client(token).get('/repos/'+repo+'/labels', (e, status, body) => {
            if (e) rej(e);
            res(body);
          });
        });
      };


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

//    TODO: this function is ripe for some refactoring
const doRemovePrompts = ( token, repo ) => {
        octonode.client(token).get('/repos/'+repo+'/labels', (e, status, body) => {
          iq.prompt([{
            name:     "removals",
            type:     "checkbox",
            message:  "Which labels would you like to remove?",
            choices:  body.map((label) => label.name),
            filter:   (removals) => {
              return body.filter((label) => {
                return removals.indexOf(label.name) > -1 ? { name: label.name, color: label.color } : false;
              });
            }
          }], (answers) => {
            //  early return if no labels
            //  TODO: this could be a check in the above prompt
            if ( answers.removals.length === 0 ) {
              console.log("No labels chosen to remove.");
              return ;
            };

            //  Tell the user what they're about to lose
            console.log("About to delete the following labels:")
            answers.removals.map((label)=>{
              return " - "+label.name;
            }).forEach((prettyLabel)=>{
              console.log(prettyLabel);
            });
            //  Ya sure ya wanna do this bud?
            iq.prompt([{
              name:     "youSure",
              type:     "confirm",
              message:  "Are you sure you want to delete these labels?",
              default:  true
            }], (confirmRemove) => {
              if ( confirmRemove.youSure ) {
                gitLabel.remove( configGitLabel(repo, token), answers.removals )
                .then(console.log)
                .catch(console.warn);
              } else {
                process.exit(1)
              }
            })

          });
        });
      };


//  Promise-based check to see if we're even in a Git repo
const isGitRepo = () => {
        return new Promise((res, rej) => {
          fs.readdir(process.cwd()+'/.git/', (e, files) => {
            if (e) rej("Not a git repo!");
            res(true);
          })
        });
      };
//  Promise-based reading the git config to find the repo
const readGitConfig  = () => {
        return new Promise((res, rej)=>{
          fs.readFile( process.cwd()+'/.git/config', 'utf8', (e, data) => {
            if (e) rej(e);
            res( data );
          })
        });
      };
//  Returns a config for gitLabel
const configGitLabel = (repo, token) => {
        return {
          api:    'https://api.github.com',
          repo:   repo,
          token:  token
        }
      };

//    TODO: could be refactored to return the git.add as a promise..?
const handleAddPrompts = (repo, token, newLabels) => {
        gitLabel.add( configGitLabel(repo, token), newLabels )
          .then(console.log)
          .catch(console.warn);
      };

const handleMainPrompts = (repo, ans) => {
        if ( ans.main.toLowerCase() === "reset token" ){
          banner.resetToken();
          //  process will end after new token is set
          return setToken((token) => {
            banner.welcome();
            iq.prompt( prompts.mainMenu, handleMainPrompts.bind(null, repo));
          });
        }
        //  if it's not to reset the token then we
        fetchToken()
          .then((token)=>{
            if ( ans.main.toLowerCase() === "add custom labels" ){
              banner.addCustom();
              return doCustomLabelPrompts( [], handleAddPrompts.bind(null, repo, token));
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
                    //  TODO: make that fn loop over an array of replaces, or make it REMOVEALL and ditch that 3rd param
                    packagePath = replaceAll( replaceAll( replaceAll(packagePath, '`', ""), '"', "" ), "'", "" )
                    if ( fs.statSync( process.cwd()+"/"+packagePath ) ){
                      return true;
                    }
                  } catch (e){
                    return e;
                  }
                }
              }], (ans) => {
                gitLabel.find( replaceAll( replaceAll( replaceAll(ans.path, '`', ""), '"', "" ), "'", "" ) )
                  .then((newLabels)=>{
                    return gitLabel.add( configGitLabel(repo, token), newLabels )
                  })
                  .then(console.log)
                  .catch(console.warn);
              });
            }
            if ( ans.main.toLowerCase() === "remove labels" ){
              banner.removeLabels();
              doRemovePrompts(token, repo);
            }
          })
          .catch((msg)=>{
            console.log(msg);
            setToken((token) => {
              banner.welcome();
              iq.prompt( prompts.mainMenu, handleMainPrompts.bind(null, repo));
            });
          });
      };

//    LET'S DO IT
    Promise.all([ isGitRepo(), readGitConfig() ])
      .then(( values )=>{
        let repo = readRepo(values[1]);
        banner.welcome();
        iq.prompt( prompts.mainMenu, handleMainPrompts.bind(null, repo));
      })
      .catch((e)=>{
        console.warn("Please run git-labelmaker from inside a git repo!")
        process.exit(1);
      });
