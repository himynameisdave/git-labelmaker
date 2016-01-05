#!/usr/bin/env node
"use strict";

const fs = require("fs"),
      iq = require("inquirer"),
      prompts = require("./components/prompts");


//  Responsible for fetching and returning our config/token
const fetchToken = () => {
        return new Promise((res, rej)=>{
          fs.readFile(__dirname+"/.token.json", 'utf8', (e, data) => {
            if (e) rej("No token.json file found!");
            if (JSON.parse(data).token === "") rej("No token found!");
            res(JSON.parse(data).token);
            res();
          });
        });
      };
//  Responsible for asking the user what their token is, and then storing it
//  executed only if it can't be found!
const setToken = (done) => {
        iq.prompt([{
            type: "input",
            name: "token",
            message: "What is your GitHub Access Token?",
            default: "eg: 12345678..."
        }], (answer) => {
          fs.writeFile( __dirname+'/.token.json', JSON.stringify( { "token": answer.token }, null, 2 ), 'utf8', (e)=>{
            if (e) throw e;
            console.log("Stored new token!");
            done(answer.token);
          });
        });

      };
//  Recurivley asks if you want to add another new label, then calls a callback when youre all done
const doPrompts = ( newLabels, done ) => {
        iq.prompt( prompts, ( answers ) => {
          newLabels.push({ name: answers.labelName, color: answers.labelColor });
          if ( answers.addAnother ){
            doPrompts( newLabels, done );
          }else{
            done( newLabels );
          }
        });
      };

const addLabels = (token) => {


      };
//  Promise-based check to see if we're even in a Git repo
const isGitRepo = () => {
        return new Promise((res, rej) => {
          fs.readdir(process.cwd()+'/.git/', (e, files) => {
            if (e) rej(false);
            res(true);
          })
        });
      };

//  Promise-based reading the git config to find the repo
const readRepo  = () => {
        return new Promise((res, rej)=>{
          fs.readFile( process.cwd()+'/.git/config', 'utf8', (e, data) => {
            if (e) rej(e);
            res( data.split("\n") );
          })
        });
      };


    Promise.all([ isGitRepo(), readRepo() ])
      .then(( values )=>{
        let isGHRepo = values[0],
            repoName = values[1];

        console.log("We are "+isGHRepo+"ly in a GH repo!");
        console.log(repoName);

        fetchToken()
          .then((token)=>{
            doPrompts( [], (newLabels) => {
              console.log("All done prompting, heres the new labels: ", newLabels)
            });
          })
          .catch((msg)=>{
            console.log(msg);
            setToken((token) => {
              doPrompts( [], (newLabels) => {
                console.log("All done prompting, heres the new labels: ", newLabels)
              });
            });
          });

      })
      .catch((e)=>{
        console.warn("Please run git-labelmaker from inside a git repo!")
        process.exit(1);
      });
