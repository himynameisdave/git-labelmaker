const password = require('../password.js');

test('it is an array with 1 prompt', () => {
    expect(password).toHaveLength(1);
});
