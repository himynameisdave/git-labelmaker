/**
 *    Ensures that the label package file actually exists
 *    @param  {String} path - path to the json file label package
 *    @return {Bool || Error} this is a try-catch where the error
 */
"use strict";
const fs = require("fs");
const removeAllFromStr = require("../utils/removeAllFromStr");
const isJsonString = require("../utils/isJsonString");

//  Not using arrows bc it will mess up "this" context
module.exports = function (path) {
  // Declare function as asynchronous, and save the done callback
  let done = this.async();
  try {
    if (path.indexOf(".json") < 0) {
      done("Not a JSON file");
      return;
    }
    let packagePath = path.indexOf("/") === 0 ? path.replace("/","") : path;
    let fullPath = process.cwd() + "/" + removeAllFromStr( packagePath, [ "`", '"', "'" ] )
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
