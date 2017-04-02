const errorGenerator = require('../error-generator.js');


test('returns a function', () => {
    const actual = errorGenerator('');
    expect(typeof actual).toBe('function');
});

test('the returned function returns an object with the correct props', () => {
    const expectedId = '1234';
    const expectedErr = 'Whoops!';
    const actual = errorGenerator(expectedId)(expectedErr);
    expect(actual).toHaveProperty('id', expectedId);
    expect(actual).toHaveProperty('err', expectedErr);
});
