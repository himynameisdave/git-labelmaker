/**
 *    Returns a promise that attempts to read the ./.git/ directory in the folder
 *    @dep    {node}     fs
 *    @return {Promise}  Promise that resolves with true if you are in a git repo
 */


const fs = require('fs');
const err = require('../utils/errorGenerator')('GIT_REPO')('Please run git-labelmaker inside a git repository!');

module.exports = () => new Promise((res, rej) => {
    fs.readdir(`${process.cwd()}/.git/`, (e, files) => {
        if (e) rej(err);
        res(true, files);
    });
});
