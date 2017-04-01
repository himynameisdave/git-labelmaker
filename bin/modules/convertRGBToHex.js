/**
 *    Accepts a string and finds three RGB values in it. Returns the hex of it.
 *    @param  {String} color - a string that has three values in it. could be "1, 2, 3", could be "rgb(1, 2, 3)";
 *    @return {String} hex - the hex of the above color
 */


const rgbHex = require('rgb-hex');
const removeAllFromStr = require('../utils/removeAllFromStr');

module.exports = (color) => {
  // strip other shit off, return an array
    const values = color.split(',').map((val) => removeAllFromStr(val.toLowerCase(), ['rgb', '(', ')', ' ']));
    if (values.length < 3) return new Error('You must pass a valid RGB value to convertRGBToHex!');
    return rgbHex(values[0], values[1], values[2]);
};
