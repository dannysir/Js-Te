export const getErrorMsg = (expect, actual) => {
  return `Expected ${JSON.stringify(expect)} but got ${JSON.stringify(actual)}`;
};

export const getTestResultMsg = (success, fail) => {
  return `\nTests: ${success} passed, ${fail} failed, ${success + fail} total`;
};

export const RUNNING_TEST_MSG = 'Running tests...\n';

export const CHECK = '✓ ';

export const CROSS = '✗ ';

export const DIRECTORY_DELIMITER = ' > ';

export const EMPTY = '';

export const DEFAULT_COUNT = 0;

export const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  bold: '\x1b[1m'
};