/**
 *    Ensures that the label package file actually exists
 *    @param  {String} path - path to the json file label package
 *    @return {Bool || Error} this is a try-catch where the error
 */
"use strict";
const fs = require("fs");
const path = require("path");
const removeAllFromStr = require("../utils/removeAllFromStr");
const isJsonString = require("../utils/isJsonString");

//  Not using arrows bc it will mess up "this" context
module.exports = function (jsonPath) {
  // Declare function as asynchronous, and save the done callback
  let done = this.async();
  // this is clunky, but this way we can just use a default
  if (jsonPath === "") done(true);
  try {
    if (jsonPath.indexOf(".json") < 0) {
      done("Not a JSON file");
      return;
    }
    // Calculate the full path of the JSON file based upon the current working directory. Using
    // path.resolve allows for absolute paths to be used also.
    let fullPath = path.resolve(process.cwd(), jsonPath);
    fs.readFile(fullPath, (err, data) => {
      if (err){ done(err); return; }
      if (isJsonString(data)) {
        done(true);
      }
      done("Not a valid JSON file");
    });
  } catch (e){
    done(e);
    return;
  }
};
