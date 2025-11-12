import {
  CHECK,
  CROSS, DEFAULT_COUNT, DIRECTORY_DELIMITER, EMPTY,
  getErrorMsg,
  getTestResultMsg,
  RUNNING_TEST_MSG
} from "./constants.js";
import {Tests} from "./src/tests.js";
import {bold, green, red} from "./utils/consoleColor.js";

const tests = new Tests();

export const test = (description, fn) => tests.test(description, fn);

export const describe = (suiteName, fn) => tests.describe(suiteName, fn);

export function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(getErrorMsg(expected, actual));
      }
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(getErrorMsg(expected, actual));
      }
    },
    toThrow(expected) {

    },
    toBeTruthy() {

    },
    toBeFalsy() {

    },
  };
}

export async function run() {
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

  console.log(`\nTests: ${green(passed + ' passed')}, ${red(failed + ' failed')}, ${bold(passed + failed + ' total')}`);

  tests.clearTests();

  return {passed, failed};
}