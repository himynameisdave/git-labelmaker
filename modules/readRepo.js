/**
 *    Returns the repo ("user/repo") based on the input git config file contents
 *    @dep    {npm}     github-url-from-git
 *    @param  {String}  rawConfig
 *    @return {String}  repo
 */
"use strict";
const gitUrl = require("github-url-from-git");

module.exports = ( rawConfig ) => {
  //  Break the config file contents into an array of newlines
  let urlLine = rawConfig.split("\n").filter( (item) => {
    //  returns only the line with "url = " on it
    return item.indexOf("url = ") > -1;
  })[0].split("url = ")[1];// gets everything on the url line following "url = "
  let repoParts = gitUrl(urlLine).split("/");// gives us an array of each part of
  return repoParts[repoParts.length-2] + "/" + repoParts[repoParts.length-1];
};
