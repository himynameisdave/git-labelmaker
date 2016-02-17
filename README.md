## :flags: git-labelmaker
Edit GitHub labels from the command line using **`git-labelmaker`**! You can easily add or remove GitHub labels, making it easier for your projects to adhere to a sane labelling scheme.

### Install

Install `git-labelmaker` globally:

```
npm i -g git-labelmaker
```

### Usage

Using this bad boy is a breeze. First `cd` into your git repository, run the command and follow the prompts!

```
git-labelmaker
```

![Preview of git-labelmaker](http://i.imgur.com/RhERIOq.png)

#### Token

If it's the first time running it, you will be prompted for a GitHub token, which you can [generate over here](https://github.com/settings/tokens). You can reset your token later, but otherwise `git-labelmaker` will remember it for you. Your token must have `repo` permissions.

#### Add Custom Labels

You can add your own labels one at a time. You will be prompted for your new label's text and color. Include the `#` in front of your 3 or 6 digit hex color. Add as many as you like!

#### Add Labels From Package

If you have a labels package in your current directory that you would like to use for adding labels, just supply the path and name of that file. So like if it's at the root of the current directory, just `labels.json`.

It must be a valid `.json` file, and must match the expected format. Check out [these really good ones](https://github.com/jasonbellamy/git-label-packages/tree/master/packages) if you need a template.

#### Remove Labels

You can also remove labels. Just select the ones you want to ditch and :boom: they're gone.

### Contributing

Feel free to contribute to the project by opening a [Pull Request](https://github.com/himynameisdave/git-labelmaker/compare), filing a [new issue](https://github.com/himynameisdave/git-labelmaker/issues/new), or by barking at me on [the twitters](https://twitter.com/dave_lunny).

**Related Stuff:**
> - [`git-label`](https://github.com/jasonbellamy/git-label) by [**jasonbellamy**](https://github.com/jasonbellamy), which `git-labelmaker` uses to add and remove labels
> - [`git-label-packages`](https://github.com/jasonbellamy/git-label-packages) is a really good set of default packages if you really want to level up your projects
> - [`git-label-faces`](https://github.com/himynameisdave/git-label-faces) is a joke package set that you should totally never use for real

---

*Created by [Dave Lunny](https://twitter.com/dave_lunny) in the wonderful year of 2016.*
*Licensed under MIT :hand:*
