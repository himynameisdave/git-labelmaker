#!/usr/bin/env node

'use strict'; // eslint-disable-line

//    EXTERNAL DEPENDENCIES
const fs                   = require('fs');
const iq                   = require('inquirer');
const gitLabel             = require('git-label');
//    UTILS ARE STANDALONE METHODS WITH NO DEPENDENCIES
const alertDeletes         = require('./utils/alertDeletes');
const banner               = require('./utils/banners');
const configGitLabel       = require('./utils/configGitLabel');
const filterRemovalLabels  = require('./utils/filterRemovalLabels');
const removeAllFromStr     = require('./utils/removeAllFromStr');
const validateRemovals     = require('./utils/validateRemovals');
//    PROMPTS ARE THE PROMPTS ARRAYS FOR VARIOUS QUESTIONS
const prompts              = {
    addCustom:           require('./prompts/addCustom'),
    deleteConfirm:       require('./prompts/deleteConfirm'),
    mainMenu:            require('./prompts/mainMenu'),
};
//    MODULES ARE UTILS WITH DEPENDENCIES
const convertRGBToHex      = require('./modules/convertRGBToHex');
const doCustomLabelPrompts = require('./modules/doCustomLabelPrompts')(prompts.addCustom);
const readRepo             = require('./modules/readRepo');
const setToken             = require('./modules/setToken');
const fetchToken           = require('./modules/fetchToken');
const isGitRepo            = require('./modules/isGitRepo');
const readGitConfig        = require('./modules/readGitConfig');
const requestLabels        = require('./modules/requestLabels');
const prompt               = require('./modules/prompt');
const validateAddPackages  = require('./modules/validateAddPackages');

//    Kicks things off, named so that it can be called at any time
//    The params will sometimes come thru if we've just set the token, so if we got them we alter the call a lil...
const gitLabelmaker = (token) => {
    Promise.all([isGitRepo(), readGitConfig(), fetchToken(token)])
      .then(values => {
          //  TODO: this is a bit callback-hellish
          readRepo(values[1])
            .then(_repo => {
                const _token = values[2];
                banner.welcome();
                iq.prompt(prompts.mainMenu, handleMainPrompts.bind(null, _repo, _token)); // eslint-disable-line no-use-before-define
            })
            .catch(e => {
                console.error(e);
                process.exit(1);
            });
      })
      .catch(e => {
          switch (e.id) {
              case 'TOKEN':
                  return setToken(gitLabelmaker);
              case 'QUIT':
                  banner.seeYa();
                  return process.exit(0);
              case 'PASSWORD':
                  banner.wrongPassword();
                  return gitLabelmaker();
              default:
                  console.warn(e);
                  return process.exit(1);
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
    return doCustomLabelPrompts([], newLabels => {
        newLabels.map(newLabel => {
            if (newLabel.color.indexOf(',') > -1) {
                try {
                    newLabel.color = convertRGBToHex(newLabel.color); // eslint-disable-line
                } catch (e) {
                  //  graceful quit if one of the values isn't actually rgb;
                    console.log(e);
                    gitLabelmaker(token);
                }
            }
            return newLabel;
        }).map(newLabel => {
            const _newLabel = newLabel;
            _newLabel.color = `#${newLabel.color}`;
            return _newLabel;
        });
        gitLabel.add(configGitLabel(repo, token), newLabels)
          .then(console.log)
          .catch(console.warn);
    });
};

//    addFromPackage function
const addFromPackage = (repo, token, path) => {
    gitLabel.find(removeAllFromStr(path, ['`', '"', '\'']))
      .then(newLabels => gitLabel.add(
          configGitLabel(repo, token), newLabels)
      )
      .then(console.log)
      .catch(console.warn);
};

//    removeLabels function
const removeLabels = (repo, token, answers) => {
    //  Tell the user what they're about to lose
    console.log('About to delete the following labels:');
    alertDeletes(answers.removals);// alerts the list of labels to be removed
    //  Ya sure ya wanna do this bud?
    prompt(prompts.deleteConfirm)
      .then(confirmRemove => {
          if (confirmRemove.youSure) {
              return gitLabel.remove(configGitLabel(repo, token), answers.removals);
          }
          return gitLabelmaker();
      })
      .then(console.log)
      .catch(console.warn);
};

//    Callback for the main prompts, handles program flow
const handleMainPrompts = (repo, token, ans) => {
    let labelPkg = [];
    switch (ans.main.toLowerCase()) {
        case 'quit':
            banner.seeYa();
            return process.exit(1);

        case 'reset token':
            return resetToken();

        case 'add custom labels':
            return addCustom(repo, token);

        case 'add labels from package':
            banner.addFromPackage();
            return prompt([{
                name:    'path',
                type:    'input',
                message: 'What is the path & name of the package you want to use? (eg: `packages/my-label-pkg.json`)',
                validate: validateAddPackages,
            }])
            .then(answer => addFromPackage(repo, token, answer.path))
            .catch(console.warn);

        case 'create a package from labels':
            banner.createPkgFromLabels();
            return requestLabels(repo, token)
              .then(labels => {
                  if (labels.length <= 0) return new Error('This repo has no labels to generate a package with!');
                  //  tell the user what labels we are going to remove
                  console.log('Creating a labels package from these labels:');
                  labelPkg = labels.map(label => {
                      console.log(` - ${label.name}`);
                      return { name: label.name, color: `#${label.color}`, };
                  });
                  return prompt([{
                      name:    'name',
                      type:    'input',
                      message: 'What would you like to name this .json file?',
                      default: 'labels.json',
                  }]);
              })
              .then(answer => {
                  const _answer = answer;
                  if (answer.name.indexOf('.json') < 0) {
                      _answer.name = `${answer.name}.json`;
                  }
                  fs.writeFile(answer.name, JSON.stringify(labelPkg, null, 2), e => {
                      if (e) throw e;
                      console.log(`Saved labels as ${answer.name}`);
                      gitLabelmaker(token);
                  });
              })
              .catch(console.warn);

        case 'remove labels':
            banner.removeLabels();
            //  If there are no labels to be removed then we can skip this part
            return requestLabels(repo, token)
              .then(labels => {
                  if (labels.length <= 0) return new Error('This repo has no labels to remove!');
                  return prompt([{
                      name:     'removals',
                      type:     'checkbox',
                      message:  'Which labels would you like to remove?',
                      choices:  labels.map((label) => label.name),
                      validate: validateRemovals,
                      filter:   filterRemovalLabels.bind(null, labels),
                  }]);
              })
              .then(answers => {
                  if (answers.removals) {
                      return removeLabels(repo, token, answers);
                  }
                  return console.log(answers);
              })
              .catch(console.warn);

        case 'remove all labels':
            banner.removeAllLabels();
            return requestLabels(repo, token)
              .then(labels => {
                  if (labels.length !== 0) {
                      removeLabels(repo, token, {
                          removals: labels,
                      });
                  } else {
                      console.log('No labels to remove.');
                  }
              })
              .catch(console.warn);

        default:
            return gitLabelmaker();
    }
};

//  Begin our application
gitLabelmaker();
