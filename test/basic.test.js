import {describe, expect, isMocked, mock, test} from "../index.js";

describe('[describe depth test] - 1단계', () => {
  describe('2단계', () => {
    describe('3단계', () => {
      describe('4단계', () => {
        test('테스트', () => {
          expect([1, 2, 3]).toEqual([1, 2, 3]);
        });
      });
    });
  });
});

describe('[function return test] - expect arg', () => {
  test('[ERROR] - expect throw Error', () => {
    expect(() => {
      throw new Error('ERROR');
    }).toThrow('ERROR');
  });
});

test('[mocking] - mocking random function', async () => {
  mock('/src/test-helper/random.js', {
    random: () => 3,
  });
  const {play} = await import('../src/test-helper/game.js');
  expect(play()).toBe(30);
});