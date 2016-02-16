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
      removeAll            = require("./utils/removeAll"),
      validateRemovals     = require("./utils/validateRemovals");
//    PROMPTS ARE THE PROMPTS ARRAYS FOR VARIOUS QUESTIONS
const prompts              = {
        addCustom:           require("./prompts/addCustom"),
        deleteConfirm:       require("./prompts/deleteConfirm"),
        mainMenu:            require("./prompts/mainMenu")
      };
//    MODULES ARE UTILS WITH DEPENDENCIES
const doCustomLabelPrompts = require("./modules/doCustomLabelPrompts")(prompts.addCustom),
      readRepo             = require("./modules/readRepo"),
      setToken             = require("./modules/setToken"),
      fetchToken           = require("./modules/fetchToken"),
      isGitRepo            = require("./modules/isGitRepo"),
      readGitConfig        = require("./modules/readGitConfig"),
      requestLabels        = require("./modules/requestLabels"),
      prompt               = require("./modules/prompt"),
      validateAddPackages  = require("./modules/validateAddPackages");


//    Kicks things off, named so that it can be called at any time
const gitLabelmaker = (mainPromptCallback) => {
  //  Checks for three things at once, each will return a nice error obj if they fail
  Promise.all([ isGitRepo(), readGitConfig(), fetchToken() ])
    .then(( values )=>{
      let repo = readRepo(values[1]);
      let token = values[2];
      banner.welcome();
      iq.prompt( prompts.mainMenu, mainPromptCallback.bind(null, repo, token));
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

//    resetToken function
const resetToken = () => {
  banner.resetToken();
  return setToken(gitLabelmaker);
};

//    addCustom labels function
const addCustom = (repo, token) => {
  banner.addCustom();
  return doCustomLabelPrompts( [], (newLabels) => {
    gitLabel.add( configGitLabel(repo, token), newLabels )
      .then(console.log)
      .catch(console.warn);
  });
};

//    addFromPackage function
const addFromPackage = (repo, token, path) => {
  gitLabel.find( removeAll( path, [ "`", '"', "'" ] ) )
    .then((newLabels)=>{
      return gitLabel.add( configGitLabel(repo, token), newLabels );
    })
    .then(console.log)
    .catch(console.warn);
};

//    removeLabels function
const removeLabels = (repo, token, mainPromptCallback, answers) => {
  //  Tell the user what they're about to lose
  console.log("About to delete the following labels:");
  alertDeletes(answers.removals);// alerts the list of labels to be removed
  //  Ya sure ya wanna do this bud?
  prompt(prompts.deleteConfirm)
    .then((confirmRemove)=>{
      if ( confirmRemove.youSure ) {
        return gitLabel.remove( configGitLabel(repo, token), answers.removals );
      }
      gitLabelmaker(mainPromptCallback);
    })
    .then(console.log)
    .catch(console.warn);
};

//    Callback for the main prompts, handles program flow
const handleMainPrompts = (repo, token, ans) => {
        switch ( ans.main.toLowerCase() ) {
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

          case "remove labels":
            banner.removeLabels();
            requestLabels(repo, token)
              .then((labels)=>{
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
                removeLabels(repo, token, handleMainPrompts, answers);
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
            gitLabelmaker(handleMainPrompts);
        }
      };

gitLabelmaker(handleMainPrompts);
