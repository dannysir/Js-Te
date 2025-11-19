import {DIRECTORY_DELIMITER} from "../constants.js";

export class Tests {
  #tests = [];
  #testDepth = [];
  #beforeEachArr = [];

  describe(str, fn) {
    this.#testDepth.push(str);
    const prevLength = this.#beforeEachArr.length;
    fn();
    this.#beforeEachArr.length = prevLength;
    this.#testDepth.pop();
  }

  test(description, fn) {
    const beforeEachHooks = [...this.#beforeEachArr];

    const testObj = {
      description,
      fn: async () => {
        for (const hook of beforeEachHooks) {
          await hook();
        }
        await fn();
      },
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

  beforeEach(fn) {
    this.#beforeEachArr.push(fn);
  }

  getTests() {
    return [...this.#tests];
  }

  clearTests() {
    this.#tests = [];
    this.#testDepth = [];
    this.#beforeEachArr = [];
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