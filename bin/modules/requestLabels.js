/**
 *    Promisifies the requesting for labels
 *    @deps   {npm}    octonode - used to request the list of current labels
 *    @param  {String} repo - the working repo
 *    @param  {String} token - the user's GH API token
 *    @return {Promise} - Promise that resolves with the repo's labels, rejects with octonode error
 */


const octonode = require('octonode');

module.exports = (repo, token) => new Promise((res, rej) => {
    octonode.client(token).get(`/repos/${repo}/labels`, { per_page: 100, }, (e, status, body) => {
        if (e) return rej(e);
        return res(body);
    });
});
