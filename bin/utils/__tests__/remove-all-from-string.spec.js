const removeAllFromStr = require('../remove-all-from-str.js');

test('it removes the given items from the string', () => {
    const testStr = '1 ONE 2 TWO 3 THREE';
    const removals = ['1', '2', '3'];
    const actual = removeAllFromStr(testStr, removals);
    expect(actual.indexOf(removals[0])).toBe(-1);
    expect(actual.indexOf(removals[1])).toBe(-1);
    expect(actual.indexOf(removals[2])).toBe(-1);
});
