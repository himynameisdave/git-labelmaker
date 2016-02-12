/**
 *    Returns a promise that fetches the token and resolves with it if it's found
 *    @dep    {node}    fs
 *    @param  {Promise}
 */
"use strict";
const fs = require("fs");

module.exports = () => {
  return new Promise((res, rej)=>{
    fs.readFile(__dirname+"/.token.json", 'utf8', (e, data) => {
      if (e) rej("No token.json file found!");
      if (JSON.parse(data).token === "") rej("No token found!");
      res(JSON.parse(data).token);
    });
  });
};
