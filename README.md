## :flags: git-labelmaker [![travis-build-badge](https://api.travis-ci.org/himynameisdave/git-labelmaker.svg?branch=master)](https://travis-ci.org/himynameisdave/git-labelmaker) [![Coverage Status](https://coveralls.io/repos/github/himynameisdave/git-labelmaker/badge.svg?branch=master)](https://coveralls.io/github/himynameisdave/git-labelmaker?branch=master)

**Version `v2.0.0-beta` branch**

⚠️ This branch is unstable and may not work as intended. You have been warned. ⚠️

---

Edit your repository's labels from the command line with **`git-labelmaker`**. This allows you to easily ensure that your projects to adhere to a [sane labelling](https://medium.com/@dave_lunny/sane-github-labels-c5d2e6004b63) scheme.

### Install

Install `git-labelmaker` globally:

```
yarn global add git-labelmaker

OR

npm i -g git-labelmaker
```

Requires a node version of `>= 4.0.0` or higher.

### Usage

Navigate into any git directory, then run the command:

```
git-labelmaker

OR

glm
```

### Tokens

You're going to need a token if you want to access either the GitHub or GitLab APIs to be able to edit labels.

**GitHub**

- [Generate over here](https://github.com/settings/tokens).
- Make sure your token has `repo` permissions.

**GitLab**

- [Generate over here](https://gitlab.com/profile/personal_access_tokens).
- Make sure your token has `api` scope.


### Contributing

Feel free to contribute to the project by opening a [Pull Request](https://github.com/himynameisdave/git-labelmaker/compare), filing a [new issue](https://github.com/himynameisdave/git-labelmaker/issues/new).

You can read the contributing guide [over here](https://github.com/himynameisdave/git-labelmaker/blob/master/.github/CONTRIBUTING.md).

**Related Stuff:**
> - [`git-label`](https://github.com/jasonbellamy/git-label) by [**jasonbellamy**](https://github.com/jasonbellamy), which `git-labelmaker` uses to add and remove labels
> - [`git-label-packages`](https://github.com/jasonbellamy/git-label-packages) is a really good set of default packages if you really want to level up your projects
> - [`git-label-faces`](https://github.com/himynameisdave/git-label-faces) is a joke package set that you should totally never use for real
> - [Sane GitHub Labels](https://medium.com/@dave_lunny/sane-github-labels-c5d2e6004b63) - an article I wrote about the importance of a good, rational labelling system in your projects

---

*Created by [Dave Lunny](https://twitter.com/dave_lunny) in the glorious year of 2018.*
*Licensed under MIT :hand:*
