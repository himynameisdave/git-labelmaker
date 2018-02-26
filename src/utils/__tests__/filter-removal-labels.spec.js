const filterRemovalLabels = require('../filter-removal-labels.js');

test('returns a filtered list based on the given names', () => {
    const mockLabels = [
        {
            name: 'one',
            color: '#123456',
        }, {
            name: 'two',
            color: '#123456',
        }, {
            name: 'three',
            color: '#123456',
        }, {
            name: 'four',
            color: '#123456',
        }, {
            name: 'five',
            color: '#123456',
        },
    ];
    const expected = ['one', 'three', 'five'];
    const actual = filterRemovalLabels(mockLabels, expected);
    expect(actual.length).toBe(3);
    expect(actual.map(r => r.name)).toEqual(expect.arrayContaining(expected));
});
