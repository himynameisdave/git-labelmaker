/**
 *    Returns a promise that fetches the token and resolves with it if it's found
 *    @dep    {node}    fs
 *    @return {Promise}
 */
"use strict";
const fs = require("fs");
const err = (message) => {
  return { id: "TOKEN", err: message }
};

const Buttercup = require("buttercup");

module.exports = () => {
  return new Promise((res, rej) => {
    fs.exists(".git-labelmaker.token.bcup", (exists) => {
      if (!exists) {
        rej(err("No token found!"));
      }

    });
    /*
    fs.readFile(__dirname+"/../.token.json", 'utf8', (e, data) => {
      if (e || !data) rej(err("No token.json file found!"));
      if (JSON.parse(data).token === "") rej(err("No token found!"))
      res(JSON.parse(data).token);
    });*/
  });
};
