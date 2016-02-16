/**
 *    Ensures that the label package file actually exists
 *    @param  {String} path - path to the json file label package
 *    @return {Bool || Error} this is a try-catch where the error
 */
"use strict";
const fs = require("fs");
const removeAll = require("../utils/removeAll");

module.exports = (path) => {
  try {
    if (path.indexOf(".json") < 0) throw "Not a JSON file";
    let packagePath = path.indexOf("/") === 0 ? path.replace("/","") : path;
    packagePath = removeAll( packagePath, [ "`", '"', "'" ] );
    if ( fs.statSync( process.cwd()+"/"+packagePath ) ){
      return true;
    }
  } catch (e){
    return e;
  }
};
