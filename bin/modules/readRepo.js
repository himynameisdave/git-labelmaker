/**
 *    Returns the repo ("user/repo") based on the input git config file contents
 *    @dep    {npm}     github-url-from-git
 *    @param  {String}  rawConfig
 *    @return {String}  repo
 */
"use strict";
const gitUrl = require("github-url-from-git");

module.exports = ( config ) => {
  // Retrieve the url of the origin remote
  // Some repo can have multiple origin
  const url = config['remote "origin"']['url'];
  const repoParts = gitUrl(url).split("/");// gives us an array of each part of
  return repoParts[repoParts.length-2] + "/" + repoParts[repoParts.length-1];
};
