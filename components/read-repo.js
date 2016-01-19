"use strict";

const gitUrl = require("github-url-from-git");

module.exports = ( rawConfig ) => {
  let urlLine = rawConfig.filter( (item) => {
    return item.indexOf("url = ") > -1;
  })[0].split("url = ")[1];
  let repoParts = gitUrl(urlLine).split("/");
  let repo = repoParts[repoParts.length-2] + "/" + repoParts[repoParts.length-1];
  return repo;
};
