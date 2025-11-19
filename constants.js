export const getErrorMsg = (expect, actual) => {
  return `Expected ${JSON.stringify(expect)} but got ${JSON.stringify(actual)}`;
};

export const RESULT_TITLE = {
  TESTS: 'Tests: ',
  TOTAL : 'Total Result: '
};

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

export const MOCK = {
  STORE_NAME: 'mockStore',
  STORE_PATH : '@dannysir/js-te/src/mock/store.js'
};

export const BABEL = {
  MODULE: 'module',
  CONST: 'const',
  HAS: 'has',
  GET: 'get',
  PERIOD: '.',
};

export const PATH = {
  NODE_MODULES: 'node_modules',
  TEST_DIRECTORY: 'test',
  TEST_FILE: '.test.js',
  JAVASCRIPT_FILE: '.js',
  BIN: 'bin',

};