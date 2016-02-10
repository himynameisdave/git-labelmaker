/**
 *    The "Add Custom Labels" prompts
 */
"use strict";
module.exports = [
  {
    type: "input",
    name: "labelName",
    message: "What would you like to call this label?",
    validate: (val) => {
      if (val === "") return "Please enter something for the label name!";
      return true;
    }
  },{
    type: "input",
    name: "labelColor",
    message: "What color would you like this label to be?",
    validate: (val) => {
      if ( val.indexOf("#") <= -1 ) return "Please include a hash in front of the color!"
      if ( val.length > 7 || val.length < 4 ) return "Please return a hexidecimal color!"
      return true;
    }
  },{
    type: "confirm",
    name: "addAnother",
    message: "Would you like to add another label?",
    default: true
  }
];
