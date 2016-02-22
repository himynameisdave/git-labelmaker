/**
 *    The "Initial"/"Main" prompts
 */
"use strict";
module.exports = [
  {
    type:     "list",
    name:     "main",
    message:  "Welcome to git-labelmaker!\nWhat would you like to do?",
    choices:  [ "Add Custom Labels", "Add Labels From Package", "Remove Labels", "Reset Token", "Quit" ]
  }
];
