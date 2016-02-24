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
      removeAllFromStr     = require("./utils/removeAll"),
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
      if (e.id === "TOKEN") {
        setToken(gitLabelmaker);
        return;
      }

      if (e.id === "QUIT") {
        banner.seeYa();
        process.exit(0);
        return;
      }

      console.warn(e);
      process.exit(1);
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

    case "remove labels":
      banner.removeLabels();
      //  If there are no labels to be removed then we can skip this part
        requestLabels(repo, token)
          .then((labels)=>{
            if ( labels.length > 0 ){
              return prompt([{
                name:     "removals",
                type:     "checkbox",
                message:  "Which labels would you like to remove?",
                choices:  labels.map((label) => label.name),
                validate: validateRemovals,
                filter:   filterRemovalLabels.bind(null, labels)
              }]);
            } else {
              return new Error("This repo has no labels to remove!");
            }
          })
          .then((answers)=>{
            if (answers.removals){
              return removeLabels(repo, token, answers);
            }
            console.log(answers);
            gitLabelmaker();
          })
          .catch(console.warn);
      break;

    default:
      gitLabelmaker();
  }
};

//  Begin our application
gitLabelmaker();
