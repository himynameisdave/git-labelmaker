const deleteConfirm = require('../delete-confirm.js');

test('it is an array with one prompt', () => {
    expect(deleteConfirm).toHaveLength(1);
});
