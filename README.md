## git-labelmaker
:flags: Edit git labels from the command line using **`git-labelmaker`**! You can easily add or remove git-labels, making it easier for your project to adhere to a sane labelling scheme.

### Install

Install `git-labelmaker` globally:

```
npm i -g git-labelmaker
```

### Usage

Using this bad boy is a breeze. First `cd` into your repository and then run the command without any arguments:

```
git-labelmaker
```

You'll then be able to add or remove labels for the repository you are in.

If it's the first time running the command, you will be prompted for a GitHub token, which you can [generate over here](https://github.com/settings/tokens).

### About

`git-labelmaker` is essentially a sugar for the [`git-label`](https://github.com/jasonbellamy/git-label) package written by [**jasonbellamy**](https://github.com/jasonbellamy). It provides a few nice features that make creating custom labels a breeze, such as:

- stores your GH token so you don't have to keep whipping it out
- learns the gh repo name so you don't need to add it to a config
- removal based on the current labels in the repo
- wraps the whole thing in pretty [**inquirer.js**](https://github.com/SBoudrias/Inquirer.js/) prompts

---

*Created by [Dave Lunny](https://twitter.com/dave_lunny) in the wonderful year of 2016.*
*Licensed under MIT*
