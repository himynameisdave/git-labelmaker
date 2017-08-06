const convertRGBToHex = require('../convert-rgb-to-hex.js');

test('it throws an error if more than 3 RGB values are detected', () => {
    expect(() => {
        convertRGBToHex('rgb(2, 3, 4, 5)');
    }).toThrow();
});

test('it returns the expected hex value', () => {
    const testStr = 'rgb(0, 170, 204)';
    const expected = '00aacc';
    const actual = convertRGBToHex(testStr);
    expect(actual).toBe(expected);
});
