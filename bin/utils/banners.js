/**
 *    Responsible for the banners, and for printing them
 */

const pad33 = require('./pad-33.js');
const banners = require('../constants.js').banners;

const bar      = '=======================================\n';
const block    = ']|[';
const emptyRow = `${block}                                 ${block}\n`;
const printBanner =  (banner) => () => console.log(`${bar + emptyRow + block + banner + block}\n${emptyRow}${bar}`);


const props = [
    'welcome',
    'addCustom',
    'addFromPackage',
    'createPkgFromLabels',
    'removeLabels',
    'resetToken',
    'seeYa',
    'wrongPassword',
    'removeAllLabels',
];

module.exports = banners.map(pad33)
    .map(printBanner)
    .reduce((a, b, i) => Object.assign(a, { [props[i]]: b, }), {});
