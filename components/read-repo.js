"use strict";

module.exports = ( rawConfig ) => {
  let repo;
  rawConfig.forEach((item)=>{
    if (item.indexOf("url = git@github.com:") > -1)
      repo = item.split(":")[1].split(".git")[0];
  });

  return repo;
};
