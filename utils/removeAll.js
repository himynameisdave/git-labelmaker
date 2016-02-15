/**
 *    Accepts a string an array of substrings to be removed
 *    @param  {String} str - string to be cleaned
 *    @param  {Array}  finds - array of substrings to be removed
 *    @return {String} a "cleaned" string
 */
"use strict";

module.exports = (str, finds) => {
  let cleanStr = str;
  finds.map((find)=>{
    cleanStr.split(find).join("");
  });
  return cleanStr;
};
