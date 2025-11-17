import {DIRECTORY_DELIMITER} from "../constants.js";

export class Tests {
  #tests = [];
  #testDepth = [];

  describe(str, fn) {
    this.#testDepth.push(str);
    fn();
    this.#testDepth.pop();
  }

  test(description, fn) {
    const testObj = {
      description,
      fn,
      path: this.#testDepth.join(DIRECTORY_DELIMITER),
    }
    this.#tests.push(testObj);
  }

  testEach(cases) {
    return (description, fn) => {
      cases.forEach(testCase => {
        const args = Array.isArray(testCase) ? testCase : [testCase];
        this.test(this.#formatDescription(args, description), () => fn(...args));
      });
    };
  }

  getTests() {
    return [...this.#tests];
  }

  clearTests() {
    this.#tests = [];
    this.#testDepth = [];
  }

  #formatDescription(args, description) {
    let argIndex = 0;
    return description.replace(/%([so])/g, (match, type) => {
      if (argIndex >= args.length) return match;

      const arg = args[argIndex++];

      switch (type) {
        case 's':
          return arg;
        case 'o':
          return JSON.stringify(arg);
        default:
          return match;
      }
    });
  }
}