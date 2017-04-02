const banners = require('../banners.js');
const pad33 = require('../pad-33.js');
const constants = require('../../constants.js');

const bar      = '=======================================\n';
const block    = ']|[';
const emptyRow = `${block}                                 ${block}\n`;
const makeExpected = (banner) => `${bar + emptyRow + block + banner + block}\n${emptyRow}${bar}`;
const _console = console;

beforeEach(() => {
    console.log = jest.fn();
});

afterAll(() => {
    console = _console; // eslint-disable-line no-global-assign
});


test('it contains the correct number of banners', () => {
    expect(Object.keys(banners).length).toBe(constants.banners.length);
});

test('it prints the welcome banner to the console', () => {
    const expected = makeExpected(pad33(constants.banners[0]));
    banners.welcome();
    expect(console.log.mock.calls.length).toBe(1);
    expect(console.log.mock.calls[0][0]).toBe(expected);
});

test('it prints the addCustom banner to the console', () => {
    const expected = makeExpected(pad33(constants.banners[1]));
    banners.addCustom();
    expect(console.log.mock.calls.length).toBe(1);
    expect(console.log.mock.calls[0][0]).toBe(expected);
});

test('it prints the addFromPackage banner to the console', () => {
    const expected = makeExpected(pad33(constants.banners[2]));
    banners.addFromPackage();
    expect(console.log.mock.calls.length).toBe(1);
    expect(console.log.mock.calls[0][0]).toBe(expected);
});

test('it prints the createPkgFromLabels banner to the console', () => {
    const expected = makeExpected(pad33(constants.banners[3]));
    banners.createPkgFromLabels();
    expect(console.log.mock.calls.length).toBe(1);
    expect(console.log.mock.calls[0][0]).toBe(expected);
});

test('it prints the removeLabels banner to the console', () => {
    const expected = makeExpected(pad33(constants.banners[4]));
    banners.removeLabels();
    expect(console.log.mock.calls.length).toBe(1);
    expect(console.log.mock.calls[0][0]).toBe(expected);
});

test('it prints the resetToken banner to the console', () => {
    const expected = makeExpected(pad33(constants.banners[5]));
    banners.resetToken();
    expect(console.log.mock.calls.length).toBe(1);
    expect(console.log.mock.calls[0][0]).toBe(expected);
});

test('it prints the seeYa banner to the console', () => {
    const expected = makeExpected(pad33(constants.banners[6]));
    banners.seeYa();
    expect(console.log.mock.calls.length).toBe(1);
    expect(console.log.mock.calls[0][0]).toBe(expected);
});

test('it prints the wrongPassword banner to the console', () => {
    const expected = makeExpected(pad33(constants.banners[7]));
    banners.wrongPassword();
    expect(console.log.mock.calls.length).toBe(1);
    expect(console.log.mock.calls[0][0]).toBe(expected);
});

test('it prints the removeAllLabels banner to the console', () => {
    const expected = makeExpected(pad33(constants.banners[8]));
    banners.removeAllLabels();
    expect(console.log.mock.calls.length).toBe(1);
    expect(console.log.mock.calls[0][0]).toBe(expected);
});
