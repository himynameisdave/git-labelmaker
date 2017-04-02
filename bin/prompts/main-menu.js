/**
 *    The "Initial"/"Main" prompts
 */
const menuChoices = require('../constants.js').menuChoices;

module.exports = [
    {
        type:     'list',
        name:     'main',
        message:  'Welcome to git-labelmaker!\nWhat would you like to do?',
        choices:  menuChoices,
    }
];
