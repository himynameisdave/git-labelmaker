const mainMenu = require('../main-menu.js');
const menuChoices = require('../../constants.js').menuChoices;

test('it is an array with one prompt', () => {
    expect(mainMenu).toHaveLength(1);
});

test('it\'s choices are the `menuChoices` from the constants', () => {
    expect(mainMenu[0].choices).toEqual(expect.arrayContaining(menuChoices));
});
