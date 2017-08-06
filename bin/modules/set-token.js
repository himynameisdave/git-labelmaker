/**
 *    Returns a promise that fetches the token and resolves with it if it's found
 *    @dep    {npm}      inquirer
 *    @param  {Function} callback function
 */

const Buttercup = require('buttercup');
const prompt = require('./prompt.js');
const buttercup = require('../constants.js').buttercup;
const bcupPath = `${__dirname}/../../.git-labelmaker.bcup`;


const writeToken = (password, token) => new Promise((res, rej) => { // eslint-disable-line consistent-return
    const datasource = new Buttercup.FileDatasource(bcupPath);
    if (!datasource) return rej('No datasource');
    const archive = new Buttercup.Archive();
    const glGroup = archive.createGroup(buttercup.group);
    const tokenEntry = glGroup.createEntry(buttercup.entry);
    tokenEntry.setProperty(buttercup.property, token);
    datasource.save(archive, Buttercup.createCredentials.fromPassword(password))
        .then(() => res(token))
        .catch(e => rej(e));
});

module.exports = (done) => {
    prompt([{
        type: 'input',
        name: 'token',
        message: 'What is your GitHub Access Token?',
        validate: (answer) => (answer !== undefined && answer.length !== 0),
    }, {
        type: 'password',
        name: 'master_password',
        message: 'What is your master password, to keep your access token secure?',
        when: (answer) => (answer.token !== undefined && answer.token.length !== 0),
    }])
        .then((answer) => writeToken(answer.master_password, answer.token))
        .then((token) => {
            done(token);
        })
        .catch(console.warn);
};
