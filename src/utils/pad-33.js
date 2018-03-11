/**
 *    Pads a banner string to be 33 characters
 */
const S = require('string');

module.exports = (str) => S(str).pad(33).s;
