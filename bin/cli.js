#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import * as jsTe from '../index.js';
import {bold, green, red, yellow} from "../utils/consoleColor.js";

let totalPassed = 0;
let totalFailed = 0;

Object.keys(jsTe).forEach(key => {
  global[key] = jsTe[key];
});

function findTestFiles(dir) {
  const files = [];

  function walk(directory, inTestDir = false) {
    const items = fs.readdirSync(directory);
    const dirName = path.basename(directory);

    const isTestDir = dirName === 'test' || inTestDir;

    for (const item of items) {
      if (item === 'node_modules') continue;

      const fullPath = path.join(directory, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath, isTestDir);
      } else if (item.endsWith('.test.js') || isTestDir) {
        if (item.endsWith('.js')) {
          files.push(fullPath);
        }
      }
    }
  }

  walk(dir);
  return files;
}

const testFiles = findTestFiles(process.cwd());

console.log(`Found ${green(testFiles.length)} test file(s)`);

for (const file of testFiles) {
  console.log(`\n${yellow(file)}\n`);

  await import(path.resolve(file));

  const {passed, failed} = await jsTe.run();
  totalPassed += passed;
  totalFailed += failed;
}

console.log(`\nTotal Result: ${green(totalPassed + ' passed')}, ${red(totalFailed + ' failed')}, ${bold(totalPassed + totalFailed + ' total')}\n`);

if (totalFailed > 0) {
  process.exit(1);
}