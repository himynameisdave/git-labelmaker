/**
 *    Simple function that tests if a string is actually a JSON object
 *    @param  {String} str - string to be tested
 *    @return {Boolean} - returns true if it's a JSON object and false if it isn't
 */
"use strict";

module.exports = (str) => {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
};
