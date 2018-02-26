const configGitLabel = require('../config-git-label.js');

test('it returns an object with the correct props', () => {
    const repo = 'dave';
    const token = '12345';
    const actual = configGitLabel(repo, token);
    expect(actual).toHaveProperty('api', 'https://api.github.com');
    expect(actual).toHaveProperty('repo', repo);
    expect(actual).toHaveProperty('token', token);
});
