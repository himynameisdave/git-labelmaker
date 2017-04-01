/**
 *    Returns the repo ("user/repo") based on the input git config file contents
 *    @dep    {npm}     github-url-from-git
 *    @param  {String}  rawConfig
 *    @return {String}  repo
 */


const getParsedGitUrl = require('./getParsedGitUrl.js');
const prompt = require('./prompt.js');
const askWhichRemotePrompt = require('../prompts/askWhichRemote.js');
const err = require('../utils/errorGenerator')('READ_REPO')('Could not read git repo from your .git/ directory!');


//  TODO: this could be broken off into an error-throwing module
const throwReadRepoError = () => {
    console.error(`Error:\n    Code: ${err.id}\n    Message: ${err.message}`);
    process.exit(1);
};
//  TODO: Break these off too
const hasMultipleRemotes = (config) => Object.keys(config).filter(key => key.indexOf('remote') > -1);

const hasRemoteUrl = (config, remote) => remote && config[remote] && config[remote].url;


module.exports = (config) => new Promise((res, rej) => {
    const remotes = hasMultipleRemotes(config);
    if (!config || !remotes.length) return throwReadRepoError();

    if (remotes.length > 1) {
        return prompt(askWhichRemotePrompt(remotes))
          .then(({ remote, }) => {
              res(getParsedGitUrl(config, remote, throwReadRepoError));
          })
          .catch(e => {
              throwReadRepoError(e);
              rej(e); // TODO: redundant because throwReadRepoError exits
          });
    }
    if (!hasRemoteUrl(config, remotes[0])) return throwReadRepoError();
    return res(getParsedGitUrl(config, remotes[0], throwReadRepoError));
});
