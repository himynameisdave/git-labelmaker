/**
 *    Returns a promise that fetches the token and resolves with it if it's found
 *    @dep    {node}     fs
 *    @dep    {npm}      inquirer
 *    @param  {Function} callback function
 */
"use strict";
const fs = require("fs");
const prompt = require("./prompt");
const writeToken = (token) => {
  return new Promise((res, rej)=>{
    fs.writeFile( __dirname+'/../.token.json', JSON.stringify( { "token": token }, null, 2 ), 'utf8', (e)=>{
      if (e) rej(e);
      console.log("Stored new token!");
      res(token);
    })
  });
};

module.exports = (done) => {
  prompt([{
      type: "input",
      name: "token",
      message: "What is your GitHub Access Token?",
      default: "eg: 123456789..."
  }])
  .then((answer) => {
    return writeToken(answer.token);
  })
  .then((token)=>{
    done(token);
  })
  .catch(console.warn);
};
