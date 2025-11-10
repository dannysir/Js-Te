import {describe, expect, test} from "../index.js";


describe('Math operations', () => {
  test('addition works', () => {
    expect(1 + 1).toBe(2);
  });

  test('subtraction works', () => {
    expect(5 - 3).toBe(2);
  });
});

test('strings are equal', () => {
  expect('hello').toBe('hello');
});