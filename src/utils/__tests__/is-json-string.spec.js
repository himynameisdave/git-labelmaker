const isJsonString = require('../is-json-string.js');


test('returns false when a non-json string is provided', () => {
    const actual = isJsonString('DAVE }}}}}{ "is" : "cool" }');
    expect(actual).toBeFalsy();
});

test('returns true when a JSON string is provided', () => {
    const actual = isJsonString('{"dave":"dave","lastName":"123"}');
    expect(actual).toBeTruthy();
});
