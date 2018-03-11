## Contributing Guidelines

All issues, pull requests and suggestiongs are welcome. While we have no formal Contributor License Agreement, we hope that you review these guidelines and accept them. Please remember to keep all discussions and comments kind and respectful.

- [Code of Conduct](#code-of-conduct)
- [Bugs](#bugs)
- [Features](#features)
- [Git Guidelines](#git-guideines)

### <a name="code-of-conduct">Code of conduct</a>

Please review our
[code of conduct](https://github.com/himynameisdave/git-labelmaker/blob/master/.github/CODE_OF_CONDUCT.md) before contributing.

### <a name="bugs">Bugs</a>

Bugs can be reported by adding issues in the repository. Submit your bug fix by creating a Pull Request, following the [GIT guidelines](#git-guideines).

> Please make sure to browse through existing [issues](https://github.com/himynameisdave/git-labelmaker/issues) before creating a new one.

### <a name="features">Features</a>

If you have a feature that you really want to add to `git-labelmaker`, feel free to open a Pull Request. Just make sure you read the [Git Guidelines](#git-guidelines) first.

You can also suggest a new feature by [filing an issue](https://github.com/himynameisdave/git-labelmaker/issues/new).


### <a name="git-guideines">Git Guidelines</a>

Generally all work should be branched off of `master`.

#### Workflow

1. Fork and clone repository
    ```
    git clone git@github.com:YOUR-USERNAME/git-labelmaker.git
    ```
2. Create a branch in the fork

    The branch should be based on the master branch in the master repository.
    ```
    git checkout -b my-feature-or-bugfix master
    ```
3. Commit changes on your branch
    ```
    git commit -m "🏗️ Builds lots of stuff"
    ```
4. Push the changes to your fork
    ```
    git push -u myfork my-feature-or-bugfix
    ```
5. Create a pull request
    In the Github UI of your fork, create a Pull Request to the master branch of the master repository.

    Add the **Status: In Progress** label.

    Before submitting a Pull Request, make sure the following items are satisfied:

    - Code is properly linted and tested
    - TravisCI is green
    - Coveralls code coverage does not decrease

    Once your pull request is ready for review, add the **Status: In Review** label.

    > WARNING: Squashing or reverting commits and force-pushing thereafter may remove GitHub comments on code that were previously made by you or others in your commits. Avoid any form of rebasing unless necessary.
