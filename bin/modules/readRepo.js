/**
 *    Returns the repo ("user/repo") based on the input git config file contents
 *    @dep    {npm}     github-url-from-git
 *    @param  {String}  rawConfig
 *    @return {String}  repo
 */
'use strict';
const gitUrl = require('github-url-from-git');
const prompt = require('./prompt.js');
const askWhichRemotePrompt = require('../prompts/askWhichRemote.js');
const err = require('../utils/errorGenerator')('READ_REPO')('Could not read git repo from your .git/ directory!')


//  TODO: this could be broken off into an error-throwing module
const throwReadRepoError = () => {
  console.error(`Error:\n    Code: ${err.id}\n    Message: ${err.message}`);
  process.exit(1);
};
//  TODO: Break these off too
const hasMultipleRemotes = (config) => Object.keys(config).filter(key => key.indexOf('remote') > -1);
const hasRemoteUrl = (config, remote) => remote && config[remote] && config[remote]['url'];

module.exports = (config) => {

  return new Promise((res, rej) => {
    const remotes = hasMultipleRemotes(config);
    if (!config || !remotes.length) return throwReadRepoError();

    if (remotes.length > 1) {
        prompt(askWhichRemotePrompt(remotes))
            .then(({ remote }) => {
                //  TODO: DRY, this could be broken off
                const url = config[remote]['url'];
                const parsedGitUrl = gitUrl(url);
                //  Note: this is github specific
                if (!parsedGitUrl && parsedGitUrl.indexOf('https://github.com/') === -1) return throwReadRepoError();
                res(parsedGitUrl
                      .split('https://github.com/') // -> ['', 'user/repo']
                      .reduce((a,b) => b.length ? b : a) // gets the second item in array
                );
            })
            .catch(e => {
              throwReadRepoError(e);
              rej(e); // TODO: redundant because throwReadRepoError exits
            });
    } else {
      if (!hasRemoteUrl(config, remotes[0])) return throwReadRepoError();
      // Retrieve the url of the origin remote
      // Some repo can have multiple origin
      const url = config[remotes[0]]['url'];
      const parsedGitUrl = gitUrl(url);
      //  Note: this is github specific
      if (!parsedGitUrl && parsedGitUrl.indexOf('https://github.com/') === -1) return throwReadRepoError();
      res(parsedGitUrl
            .split('https://github.com/') // -> ['', 'user/repo']
            .reduce((a,b) => b.length ? b : a) // gets the second item in array
      );
    }
  });
};
