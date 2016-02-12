/**
 *    Returns a promise that fetches the token and resolves with it if it's found
 *    @dep    {node}     fs
 *    @dep    {npm}      inquirer
 *    @param  {Function} callback function
 */
"use strict";
const fs = require("fs");
const iq = require("inquirer");

const setToken = (done) => {
  iq.prompt([{
      type: "input",
      name: "token",
      message: "What is your GitHub Access Token?",
      default: "eg: 123456789..."
  }], (answer) => {
    fs.writeFile( __dirname+'/../.token.json', JSON.stringify( { "token": answer.token }, null, 2 ), 'utf8', (e)=>{
      if (e) throw e;
      console.log("Stored new token!");
      done(answer.token);
    });
  });
};
