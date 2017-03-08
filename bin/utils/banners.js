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
  welcome:             printBanner("    Welcome to git-labelmaker    "),
  addCustom:           printBanner("       Adding Custom Labels      "),
  addFromPackage:      printBanner("    Adding Labels From Package   "),
  addGlobalPackage:    printBanner("       Add Global Package        "),
  createPkgFromLabels: printBanner("   Creating Package From Labels  "),
  removeLabels:        printBanner("         Removing Labels         "),
  resetToken:          printBanner("         Resetting Token         "),
  seeYa:               printBanner("            See Ya!              "),
  wrongPassword:       printBanner("         Wrong Password!         "),
  removeAllLabels:     printBanner("       Removing All Labels       ")
};
