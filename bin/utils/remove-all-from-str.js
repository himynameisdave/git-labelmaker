/**
 *    Accepts a string an array of substrings to be removed
 *    @param  {String} str - string to be cleaned
 *    @param  {Array}  finds - array of substrings to be removed
 *    @return {String} a "cleaned" string
 */
const S = require('string');

const removeAllFromStr = (str, removals) => {
    let cleanStr = str;
    removals.map(remove => { // eslint-disable-line array-callback-return
        cleanStr = S(cleanStr).strip(remove).s;
    });
    return cleanStr;
};

module.exports = removeAllFromStr;
