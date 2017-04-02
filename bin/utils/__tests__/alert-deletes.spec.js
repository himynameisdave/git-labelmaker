'use strict';

const alertDeletes = require('../alert-deletes.js');

const _console = console;

beforeEach(() => {
    console.log = jest.fn();
});

afterAll(() => {
    console = _console; // eslint-disable-line no-global-assign
});

const getRemovals = () => {
    const rand = () => Math.floor(Math.random() * 15) + 1;
    const arr = [];
    for (let i = 0; i < rand(); i++) {
        arr.push({ name: `Testamundo #${rand()}`, });
    }
    return arr;
};

test('calls console.log the expected number of times', () => {
    const expected = getRemovals();
    alertDeletes(expected);
    expect(console.log.mock.calls.length).toBe(expected.length);
});
