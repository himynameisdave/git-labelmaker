const pad33 = require('../pad-33.js');


test('it returns a string that is 33 characters long', () => {
    const actual = pad33('dave');
    expect(actual).toHaveLength(33);
});

test('the string is padded by empty spaces', () => {
    const actual = pad33('dave');
    expect(actual.slice(0, 1)).toBe(' ');
    expect(actual.slice(actual.length - 1, actual.length)).toBe(' ');
});
