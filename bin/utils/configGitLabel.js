/**
 *    Returns a config object for git-label
 *    @param  {String} repo - string of the repo
 *    @param  {String} token - string of the token
 *    @return {Object} a config object for git-label
 */
"use strict";

module.exports = (repo, token) => {
  return {
    api:    'https://api.github.com',
    repo:   repo,
    token:  token
  }
};
