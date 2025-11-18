import {
  CHECK,
  CROSS, DEFAULT_COUNT, DIRECTORY_DELIMITER, EMPTY,
  getErrorMsg, RESULT_TITLE,
} from "./constants.js";
import {Tests} from "./src/tests.js";
import {green, red} from "./utils/consoleColor.js";
import {getTestResultMsg} from "./utils/makeMessage.js";

const tests = new Tests();

export { mock, clearAllMocks, unmock, isMocked } from './src/mock/store.js';

export const test = (description, fn) => tests.test(description, fn);
test.each = (cases) => tests.testEach(cases);

export const describe = (suiteName, fn) => tests.describe(suiteName, fn);

export const beforeEach = (fn) => tests.beforeEach(fn);

export const expect = (actual) => {
  let value = actual;

  const runArgFnc = (actual) => {
    let value = actual;
    if (typeof actual === 'function') {
      value = actual();
    }
    return value;
  };

  return {
    toBe(expected) {
      value = runArgFnc(actual);
      if (value !== expected) {
        throw new Error(getErrorMsg(expected, value));
      }
    },
    toEqual(expected) {
      value = runArgFnc(actual);
      if (JSON.stringify(value) !== JSON.stringify(expected)) {
        throw new Error(getErrorMsg(expected, value));
      }
    },
    toThrow(expected) {
      try {
        value = runArgFnc(actual);
      } catch (e) {
        if (!e.message.includes(expected)) {
          throw new Error(getErrorMsg(expected, e.message));
        } else return;
      }
    },
    toBeTruthy() {
      value = runArgFnc(actual);
      if (!value) {
        throw new Error(getErrorMsg(true, value));
      }
    },
    toBeFalsy() {
      value = runArgFnc(actual);
      if (value) {
        throw new Error(getErrorMsg(true, value));
      }
    },
  };
}

export const run = async () => {
  let passed = DEFAULT_COUNT;
  let failed = DEFAULT_COUNT;

  for (const test of tests.getTests()) {
    try {
      await test.fn();
      const directoryString = green(CHECK) + (test.path === '' ? EMPTY : test.path + DIRECTORY_DELIMITER) + test.description
      console.log(directoryString);
      passed++;
    } catch (error) {
      const errorDirectory = red(CROSS) + test.path + test.description
      console.log(errorDirectory);
      console.log(red(`  ${error.message}`));
      failed++;
    }
  }

  console.log(getTestResultMsg(RESULT_TITLE.TESTS, passed, failed));

  tests.clearTests();

  return {passed, failed};
}