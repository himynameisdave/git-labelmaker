/**
 *    Ensures that the label package file actually exists
 *    @param  {String} path - path to the json file label package
 *    @return {Bool || Error} this is a try-catch where the error
 */
"use strict";
const fs = require("fs");
const removeAll = require("../utils/removeAll");

const isJsonString = function (str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

module.exports = (path) => {
  try {
    if (path.indexOf(".json") < 0) throw "Not a JSON file";
    let packagePath = path.indexOf("/") === 0 ? path.replace("/","") : path;
    packagePath = removeAll( packagePath, [ "`", '"', "'" ] );

    let fullPath = process.cwd() + "/" + packagePath;

    fs.readFile(fullPath, (err, data) => {
      if (err) {
        throw err;
      }

      if (isJsonString(data)) {
        return true;
      }

      throw "Not a valid JSON file";
    });
  } catch (e){
    return e;
  }
};
