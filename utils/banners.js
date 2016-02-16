/**
 *    Responsible for the banners, and for printing them
 */
"use strict";

const bar      = "=======================================\n";
const block    = "]|[";
const emptyRow = block+"                                 "+block+"\n";
const printBanner =  ( banner ) => {
  return () => console.log( bar + emptyRow + block + banner + block + "\n" + emptyRow + bar );
};

module.exports = {
  welcome:          printBanner("    Welcome to git-labelmaker    "),
  addCustom:        printBanner("       Adding Custom Labels      "),
  addFromPackage:   printBanner("    Adding Labels From Package   "),
  removeLabels:     printBanner("         Removing Labels         "),
  resetToken:       printBanner("         Resetting Token         ")
};
