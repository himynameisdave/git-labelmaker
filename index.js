#!/usr/bin/env node
"use strict";

const fs = require("fs"),
      iq = require("inquirer"),
      octonode          = require("octonode"),
      gitLabel          = require("git-label"),
      readRepo          = require("./components/read-repo"),
      cleanup           = require("./components/remove-tmp-pkg"),
      mainPrompts       = require("./components/main-prompts"),
      customAddPrompts  = require("./components/add-prompts");


//  Responsible for fetching and returning our config/token
const fetchToken = () => {
        return new Promise((res, rej)=>{
          fs.readFile(__dirname+"/.token.json", 'utf8', (e, data) => {
            if (e) rej("No token.json file found!");
            if (JSON.parse(data).token === "") rej("No token found!");
            res(JSON.parse(data).token);
            res();
          });
        });
      };
//  Responsible for asking the user what their token is, and then storing it
//  executed only if it can't be found!
const setToken = (done) => {
        iq.prompt([{
            type: "input",
            name: "token",
            message: "What is your GitHub Access Token?",
            default: "eg: 12345678..."
        }], (answer) => {
          fs.writeFile( __dirname+'/.token.json', JSON.stringify( { "token": answer.token }, null, 2 ), 'utf8', (e)=>{
            if (e) throw e;
            console.log("Stored new token!");
            done(answer.token);
          });
        });
      };
//  Recursivly asks if you want to add another new label, then calls a callback when youre all done
const doCustomLabelPrompts = ( newLabels, done ) => {
        iq.prompt( customAddPrompts, ( answers ) => {
          newLabels.push({ name: answers.labelName, color: answers.labelColor });
          if ( answers.addAnother ){
            doCustomLabelPrompts( newLabels, done );
          }else{
            done( newLabels );
          }
        });
      };

const doPackageLabelPrompts = ( done ) => {
        iq.prompt([
          {
            name: "type",
            type: "list",
            message: "Do you want to use a local package or choose from a list of common label packages?",
            choices: [ "Local", "Packages" ]
          },{
            name: "pkgs",
            type: "checkbox",
            message: "Which packages would you like to use?",
            choices: [
              "git-label-packages:cla",
              "git-label-packages:priority",
              "git-label-packages:status",
              "git-label-packages:type"
            ],
            when: (answers) => {
              return answers.type.toLowerCase() === "packages";
            }
          }
        ], (ans) => {
          console.log(ans);
          // if (ans.)
          // done();
        });
      };

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
            gitLabel.remove( configGitLabel(repo, token), answers.removals )
              .then(console.log)
              .catch(console.warn);
          });
        });
      };

//  Promise-based check to see if we're even in a Git repo
const isGitRepo = () => {
        return new Promise((res, rej) => {
          fs.readdir(process.cwd()+'/.git/', (e, files) => {
            if (e) rej(false);
            res(true);
          })
        });
      };
//  Promise-based reading the git config to find the repo
const readGitConfig  = () => {
        return new Promise((res, rej)=>{
          fs.readFile( process.cwd()+'/.git/config', 'utf8', (e, data) => {
            if (e) rej(e);
            res( data );// split it at newlines
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

const handleAddPrompts = (repo, token, newLabels) => {
        gitLabel.add( configGitLabel(repo, token), newLabels )
          .then(console.log)
          .catch(console.warn);
      };

const handleMainPrompts = (repo, ans) => {
        if ( ans.main.toLowerCase() === "reset token" ){
          return setToken((token) => {
            iq.prompt( mainPrompts, handleMainPrompts.bind(null, repo));
          });
        }
        //  if it's not to reset the token then we
        fetchToken()
          .then((token)=>{
            if ( ans.main.toLowerCase() === "add labels" ){
              // check if they want to add labels from a package
              iq.prompt([{
                name:    "addMethod",
                type:    "list",
                message: "Do you want to use a label package or create custom labels?",
                choices: [ "Use a package", "Create custom labels" ]
              }], (addMethodAns) => {
                if ( addMethodAns.addMethod.toLowerCase() === "create custom labels" ) {
                  return doCustomLabelPrompts( [], handleAddPrompts.bind(null, repo, token));
                }
                doPackageLabelPrompts( handleAddPrompts.bind(null, repo, token) );
              });
            }
            if ( ans.main.toLowerCase() === "remove labels" ){
              doRemovePrompts(token, repo);
            }
          })
          .catch((msg)=>{
            console.log(msg);
            setToken((token) => {
              iq.prompt( mainPrompts, handleMainPrompts.bind(null, repo));
            });
          });
      };


//    LET'S DO IT
    Promise.all([ isGitRepo(), readGitConfig() ])
      .then(( values )=>{
        let repo = readRepo(values[1].split("\n"));
        iq.prompt( mainPrompts, handleMainPrompts.bind(null, repo));
      })
      .catch((e)=>{
        console.warn(e);
        console.warn("Please run git-labelmaker from inside a git repo!")
        process.exit(1);
      });
