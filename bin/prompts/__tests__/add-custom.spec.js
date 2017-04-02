const addCustom = require('../add-custom.js');

test('it should be an array with three prompts', () => {
    expect(addCustom).toBeDefined();
    expect(addCustom).toHaveLength(3);
});

test('the `labelName` prompt\'s validate method should return error message if val is empty', () => {
    const actual = addCustom[0].validate('');
    const expected = 'Please enter something for the label name!';
    expect(actual).toEqual(expected);
});

test('the `labelName` prompt\'s validate method should return true if val has a value', () => {
    const actual = addCustom[0].validate('Im a label!');
    expect(actual).toBeTruthy();
});
