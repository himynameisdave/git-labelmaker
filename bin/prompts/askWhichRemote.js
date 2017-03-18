/**
 *    The "are you sure you wanna delete these labels" prompt
 */
`use strict`;
module.exports = (remotes) => [{
  name:     `remote`,
  type:     `list`,
  message:  `Looks like this repository has multiple remotes.\nWhich one would you like to use?`,
  choices: remotes
}];
