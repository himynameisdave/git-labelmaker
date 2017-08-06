/**
 *    Returns a promise that fetches the token and resolves with it if it's found
 *    @dep    {node}    fs
 *    @return {Promise}
 */
const fs = require('fs');
const Path = require('path');
const Buttercup = require('buttercup');
const prompt = require('inquirer').prompt;
const constants = require('../constants.js');
const err = require('../utils/error-generator.js')('TOKEN');

const tokenActions = {
    unlock: 'Use Saved Token',
    create: 'Create New Token',
};
const bcupPath = Path.resolve(__dirname, '../..', '.git-labelmaker.bcup');

module.exports = (rememberedToken) => new Promise((res, rej) => {
    if (rememberedToken) return res(rememberedToken);
    return fs.exists(bcupPath, (exists) => {
        if (!exists) return rej(err('No token found!'));
        return prompt([{
            type:     'list',
            name:     'token_action',
            message:  'You have a saved token.\nWould you like to unlock & use this token, or create a new one?',
            choices:  [tokenActions.unlock, tokenActions.create, 'Quit'],
        }])
            .then((answer) => {
                switch (answer.token_action) {
                    case tokenActions.unlock:
                        prompt([{
                            type: 'password',
                            name: 'master_password',
                            message: 'What is your master password?',
                        }])
                            .then(ans => {
                                const datasource = new Buttercup.FileDatasource(bcupPath);
                                datasource
                                    .load(Buttercup.createCredentials.fromPassword(ans.master_password))
                                    .then((archive) => {
                                        const group = archive.findGroupsByTitle(constants.buttercup.group)[0];
                                        const entry = group.getEntries()[0];
                                        const token = entry.getProperty(constants.buttercup.property);
                                        res(token);
                                    })
                                    .catch(e => {
                                        if (e.message === 'Failed opening archive: Error: Encrypted content has been tampered with') {
                                            return rej({
                                                id: 'PASSWORD',
                                            });
                                        }
                                        return rej(err(e.message));
                                    });
                            })
                            .catch((e) => {
                                rej(err(e.message));
                            });
                        break;
                    case tokenActions.create:
                        fs.unlink(bcupPath, () => {
                            rej(err(tokenActions.create));
                        });
                        break;
                    default:
                        rej({
                            id: 'QUIT',
                            message: 'User quit the application',
                        });
                }// end switch
            });
    });
});
