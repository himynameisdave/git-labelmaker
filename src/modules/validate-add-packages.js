/**
 *    Ensures that the label package file actually exists
 *    @param  {String} path - path to the json file label package
 *    @return {Bool || Error} this is a try-catch where the error
 */


const fs = require('fs');
const path = require('path');
const isJsonString = require('../utils/is-json-string.js');

//  Not using arrows bc it will mess up "this" context
module.exports = function (jsonPath) { // eslint-disable-line func-names
  // Declare function as asynchronous, and save the done callback
    const done = this.async();
    try {
        if (jsonPath.indexOf('.json') < 0) {
            done('Not a JSON file');
            return;
        }
    // Calculate the full path of the JSON file based upon the current working directory. Using
    // path.resolve allows for absolute paths to be used also.
        const fullPath = path.resolve(process.cwd(), jsonPath);
        fs.readFile(fullPath, (err, data) => {
            if (err) { done(err); return; }
            if (isJsonString(data)) {
                done(true);
            }
            done('Not a valid JSON file');
        });
    } catch (e) {
        done(e);
    }
};
