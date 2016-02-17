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
      message: "What is your GitHub Access Token?"
  }, {
    type: "password",
    name: "master_password",
    message: "What is your master password, to keep your access token secure?",
    when: (answer) => {
      return (answer.token !== undefined && answer.token.length !== 0);
    }
  }])
  .then((answer) => {
    return writeToken(answer.token);
  })
  .then((token)=>{
    done(token);
  })
  .catch(console.warn);
};
