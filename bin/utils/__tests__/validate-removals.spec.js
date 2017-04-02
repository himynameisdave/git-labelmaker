const validateRemovals = require('../validate-removals.js');

test('when there are removals, it returns true', () => {
    const actual = validateRemovals(['hello', 'tests']);
    expect(actual).toBeTruthy();
});

test('when there are not removals, it returns the error string', () => {
    const expected = 'Please select at least one label to remove.';
    const actual = validateRemovals([]);
    expect(actual).toBe(expected);
});
