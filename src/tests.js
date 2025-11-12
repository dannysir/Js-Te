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

  getTests() {
    return [...this.#tests];
  }

  clearTests() {
    this.#tests = [];
    this.#testDepth = [];
  }
}