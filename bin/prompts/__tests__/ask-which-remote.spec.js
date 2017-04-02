const askWhichRemote = require('../ask-which-remote.js');

test('it is a function', () => {
    expect(typeof askWhichRemote).toEqual('function');
});

test('it sets the choices to the passed in remote', () => {
    const expectedRemotes = ['one', 'two', 'three'];
    const actual = askWhichRemote(expectedRemotes);
    expect(actual[0].choices).toEqual(expect.arrayContaining(expectedRemotes));
});
