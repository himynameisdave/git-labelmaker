/**
 *    Accepts a string and finds three RGB values in it. Returns the hex of it.
 *    @param  {String} color - a string that has three values in it. could be "1, 2, 3", could be "rgb(1, 2, 3)";
 *    @return {String} hex - the hex of the above color
 */


const rgbHex = require('rgb-hex');
const removeAllFromStr = require('../utils/remove-all-from-str.js');

module.exports = (color) => {
    // strip other strings off
    const stripNonValRgbText = str => removeAllFromStr(str, ['rgb', '(', ')', ' ']);
    //  rgbHex only accepts numbers, this checks for NaN
    const includesNonNumbers = arr => arr.includes(val => isNaN(val));
    //  actually generates our RGB values
    const values = color.split(',')
                      .map(val => val.toLowerCase())
                      .map(stripNonValRgbText)
                      .map(val => parseInt(val));
    // console.log(values);
    if (values.length > 3 || includesNonNumbers(values)) return new Error('You must pass a valid RGB value to convertRGBToHex!');
    return rgbHex(values[0], values[1], values[2]);
};
