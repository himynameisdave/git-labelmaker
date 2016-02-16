/**
 *    Returns a promise that attempts to read the git config file and resolve with the contents
 *    @dep    {node}     fs
 *    @return {Promise}  Promise that resolves with the contents of the git config file
 */
"use strict";
const fs = require("fs");
const err = {
  id:  "GIT_CONFIG",
  err: "Unable to read git config file!"
}

module.exports = () => {
  return new Promise((res, rej)=>{
    fs.readFile( process.cwd()+'/.git/config', 'utf8', (e, data) => {
      if (e) rej(err);
      res( data );
    })
  });
};
