## git-labelmaker
:flags: Create git labels from the command line using [`git-label`](https://github.com/jasonbellamy/git-label)!

### About

`git-labelmaker` is essentially a sugar for the [`git-label`](https://github.com/jasonbellamy/git-label) package written by [**jasonbellamy**](https://github.com/jasonbellamy). It provides a few nice features that make creating custom labels a breeze, such as:

- stores your GH token so you don't have to keep whipping it out
- learns the gh repo name so you don't need to add it to a config
- wraps the whole thing in pretty [**inquirer.js**](https://github.com/SBoudrias/Inquirer.js/) prompts

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
If it's the first time running the command, you will be prompted for a GitHub personal access token, which you can [generate over here](https://github.com/settings/tokens).

After that, it jumps right into what new labels you would like to add. Fill out the name and color of as many labels as you like. Be sure to use a proper hex color for the color (eg: `#ffffff`).

**SOME TODOS:**

- [ ] learn which api to call based on git data
- [ ] ability to remove current labels
- [ ] ability to simply use predefined [`git-label-packages`](https://github.com/jasonbellamy/git-label-packages)
- [ ] accept a parameter to reset the token


---

*Created by [Dave Lunny](https://twitter.com/dave_lunny) in the wonderful year of 2016.*
*Licensed under MIT*
