"use strict";

const rimraf = require("rimraf");

module.exports = (path) => {
  return new Promise((res, rej) => {
    rimraf( path, (e)=>{
      if(e) rej(e);
      res();
    });
  });
};
