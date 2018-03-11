/**
 *    Returns a promise that attempts to read the git config file and resolve with the contents
 *    @dep    {node}     fs
 *    @return {Promise}  Promise that resolves with the contents of the git config file
 */


const parse = require('parse-git-config');
const err = require('../utils/error-generator.js')('GIT_CONFIG')('Unable to read git config file!');

module.exports = () => new Promise((res, rej) => {
    parse((e, config) => {
        if (e) rej(err);
        res(config);
    });
});
