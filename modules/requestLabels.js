
/**
 *    Promisifies the requesting for labels
 *    @param  {String} repo - the working repo
 *    @param  {String} token - the user's GH API token
 *    @return {Promise} - Promise that resolves with the repo's labels, rejects with octonode error
 */
"use strict";
const octonode = require("octonode");

module.exports = ( repo, token ) => {
  return new Promise((res, rej)=>{
    octonode.client(token).get('/repos/'+repo+'/labels', (e, status, body) => {
      if (e) rej(e);
      res(body);
    });
  });
};
