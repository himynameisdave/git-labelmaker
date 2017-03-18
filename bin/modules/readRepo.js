/**
 *    Returns the repo ("user/repo") based on the input git config file contents
 *    @dep    {npm}     github-url-from-git
 *    @param  {String}  rawConfig
 *    @return {String}  repo
 */
"use strict";
const gitUrl = require('github-url-from-git');
const err = require('../utils/errorGenerator')('READ_REPO')('Could not read git repo from your .git/ directory!')

module.exports = ( config ) => {
  const throwReadRepoError = () => {
    console.error(`Error:\n    Code: ${err.id}\n    Message: ${err.message}`);
    process.exit(1);
  };
  if (!config || !config['remote "origin"'] || !config['remote "origin"']['url']) return throwReadRepoError();
  // Retrieve the url of the origin remote
  // Some repo can have multiple origin
  const url = config['remote "origin"']['url'];
  const parsedGitUrl = gitUrl(url);
  if (!parsedGitUrl && parsedGitUrl.indexOf('/') === -1) return throwReadRepoError();
  const repoParts = gitUrl(url).split(`/`);
  return `${repoParts[repoParts.length - 2]}/${repoParts[repoParts - 1]}`;
};
