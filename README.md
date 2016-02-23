## :flags: git-labelmaker

[![Join the chat at https://gitter.im/himynameisdave/git-labelmaker](https://badges.gitter.im/himynameisdave/git-labelmaker.svg)](https://gitter.im/himynameisdave/git-labelmaker?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
Edit GitHub labels from the command line using **`git-labelmaker`**! You can easily add or remove GitHub labels, making it easier for your projects to adhere to a [sane labelling](https://medium.com/@dave_lunny/sane-github-labels-c5d2e6004b63) scheme.

### Install

Install `git-labelmaker` globally:

```
npm i -g git-labelmaker
```

Currently you **must be using version `>= 4.0.0` of node**, because we're using some fancy-shmancy ES6 stuff (Promises are too awesome to not use), and also because the dependant package `git-label` also currently requires `>= 4.0.0`.

### Usage

Using this bad boy is a breeze. First `cd` into your git repository, run the command and follow the prompts!

```
git-labelmaker
```

![Preview of git-labelmaker](http://i.imgur.com/UYSjdNw.png)

#### Token

To interact with the GitHub API, you will need your own access token, which you can [generate over here](https://github.com/settings/tokens). Make sure your token has `repo` permissions.

Instead of having to enter your token each time, `git-labelmaker` will remember it and keep it secure for you while you instead only need to remember a password you create. You can make your password whatever you like - passwords are easier to remember than tokens!

#### Add Custom Labels

You can add your own labels one at a time. You will be prompted for your new label's text and color. Include the `#` in front of your 3 or 6 digit hex color. Add as many as you like!

#### Add Labels From Package

If you have a labels package in your current directory that you would like to use for adding labels, just supply the path and name of that file. So like if it's at the root of the current directory, just `labels.json`.

It must be a valid, parsable JSON file (although the extension doesn't matter). Check out [these really good ones](https://github.com/jasonbellamy/git-label-packages/tree/master/packages) if you need a template.

#### Remove Labels

You can also remove labels. Just select the ones you want to ditch and :boom: they're gone.

### Contributing

Feel free to contribute to the project by opening a [Pull Request](https://github.com/himynameisdave/git-labelmaker/compare), filing a [new issue](https://github.com/himynameisdave/git-labelmaker/issues/new), or by barking at me on [the twitters](https://twitter.com/dave_lunny).

**Related Stuff:**
> - [`git-label`](https://github.com/jasonbellamy/git-label) by [**jasonbellamy**](https://github.com/jasonbellamy), which `git-labelmaker` uses to add and remove labels
> - [`git-label-packages`](https://github.com/jasonbellamy/git-label-packages) is a really good set of default packages if you really want to level up your projects
> - [`git-label-faces`](https://github.com/himynameisdave/git-label-faces) is a joke package set that you should totally never use for real
> - [Sane GitHub Labels](https://medium.com/@dave_lunny/sane-github-labels-c5d2e6004b63) - an article I wrote about the importance of a good, rational labelling system in your projects

---

*Created by [Dave Lunny](https://twitter.com/dave_lunny) in the wonderful year of 2016.*
*Licensed under MIT :hand:*
