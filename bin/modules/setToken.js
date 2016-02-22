/**
 *    Returns a promise that fetches the token and resolves with it if it's found
 *    @dep    {node}     fs
 *    @dep    {npm}      inquirer
 *    @param  {Function} callback function
 */
"use strict";
const fs = require("fs");
const prompt = require("./prompt");
const bcupPath = __dirname+"/../../.git-labelmaker.bcup";
const Buttercup = require("buttercup");

const writeToken = (password, token) => {
  return new Promise((res, rej) => {
    let datasource = new Buttercup.FileDatasource(bcupPath);
    let archive = Buttercup.Archive.createWithDefaults();
    let group = archive.createGroup("git-labelmaker");
    group.setAttribute('token', token);
    datasource.save(archive, password);
    res(token);
  });
};

module.exports = (done) => {
  prompt([{
      type: "input",
      name: "token",
      message: "What is your GitHub Access Token?",
      validate: (answer) => {
        return (answer !== undefined && answer.length !== 0);
      }
  }, {
    type: "password",
    name: "master_password",
    message: "What is your master password, to keep your access token secure?",
    when: (answer) => {
      return (answer.token !== undefined && answer.token.length !== 0);
    }
  }])
  .then((answer) => {
    return writeToken(answer.master_password, answer.token);
  })
  .then((token)=>{
    done(token);
  })
  .catch(console.warn);
};
