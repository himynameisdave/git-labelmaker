/**
 *    The "Initial"/"Main" prompts
 */
"use strict";
module.exports = [
  {
    type:     "list",
    name:     "main",
    message:  "Welcome to git-labelmaker!\nWhat would you like to do?",
    choices:  [ "Add Custom Labels", "Add Labels From Package", "Add Global Package", "Create a Package From Labels", "Remove Labels", "Remove All Labels", "Reset Token", "Quit" ]
  }
];
