/**
 *    Returns a promise that fetches the token and resolves with it if it's found
 *    @dep    {node}    fs
 *    @return {Promise}
 */
"use strict";
const fs = require("fs");
const prompt = require("./prompt");
const err = (message) => {
  return { id: "TOKEN", err: message }
};

const Buttercup = require("buttercup");

module.exports = () => {
  return new Promise((res, rej) => {
    fs.exists(".git-labelmaker.bcup", (exists) => {
      if (!exists) {
        rej(err("No token found!"));
      } else {
        prompt([{
          type: "password",
          name: "master_password",
          message: "What is your master password?"
        }])
        .then((answer) => {
          let datasource = new Buttercup.FileDatasource(".git-labelmaker.bcup");
          datasource.load(answer.master_password)
            .then((archive) => {
              // This is only guaranteed to work on buttercup 0.14.0
              // I will submit a PR to buttercup to make this work in a better way
              let groups = archive.getGroups();
              let group = groups.filter((g) => g._remoteObject.title === 'git-labelmaker')[0];
              let token = group.getAttribute('token');
              res(token);
            })
            .catch((e) => {
              rej(err(e.message));
            });
        })
      }
    });
  });
};
