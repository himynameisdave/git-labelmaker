/**
 *    Promisifies an Inquirer prompt
 *    @deps   {npm}    inquirer - used for the prompting
 *    @param  {Array}  prompts - array of prompts for Inquirer
 *    @return {Promise} - Promise that resolves answers to the prompts
 */


const iq = require('inquirer');

module.exports = (prompts) => new Promise((res, rej) => {
    iq.prompt(prompts, (answers) => {
        if (!answers) rej(answers);
        res(answers);
    });
});
