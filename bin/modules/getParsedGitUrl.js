const gitUrl = require('github-url-from-git');

module.exports = (config, remote, error) => {
  const url = config[remote]['url'];
  const parsedGitUrl = gitUrl(url);
  const rootGithubUrl = 'https://github.com/';
  //  Note: this is github specific
  if (!parsedGitUrl && parsedGitUrl.indexOf(rootGithubUrl) === -1) return error();
  parsedGitUrl
        .split(rootGithubUrl) // -> ['', 'user/repo']
        .reduce((a,b) => b.length ? b : a)
};
