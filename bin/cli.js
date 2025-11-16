#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import {transformSync} from '@babel/core';
import * as jsTe from '../index.js';
import {green, yellow} from "../utils/consoleColor.js";
import {getTestResultMsg} from "../utils/makeMessage.js";
import {RESULT_TITLE} from "../constants.js";
import { babelTransformImport } from '../babelTransformImport.js';

let totalPassed = 0;
let totalFailed = 0;
const originalFiles = new Map();

Object.keys(jsTe).forEach(key => {
  global[key] = jsTe[key];
});

const transformFile = (filePath) => {
  const originalCode = fs.readFileSync(filePath, 'utf-8');
  originalFiles.set(filePath, originalCode);

  const transformed = transformSync(originalCode, {
    filename: filePath,
    plugins: [babelTransformImport],
    parserOpts: {
      sourceType: 'module',
      plugins: ['dynamicImport']
    }
  });

  fs.writeFileSync(filePath, transformed.code);
};

const restoreFiles = () => {
  for (const [filePath, originalCode] of originalFiles.entries()) {
    fs.writeFileSync(filePath, originalCode);
  }
};

const findTestFiles = (dir) => {
  const files = [];

  const walk = (directory, inTestDir = false) => {
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

const findAllSourceFiles = (dir) => {
  const files = [];

  const walk = (directory) => {
    const items = fs.readdirSync(directory);

    for (const item of items) {
      if (item === 'node_modules' || item === 'bin' || item === 'test') continue;

      const fullPath = path.join(directory, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (item.endsWith('.js') && !item.endsWith('.test.js')) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

const sourceFiles = findAllSourceFiles(process.cwd());

for (const file of sourceFiles) {
  transformFile(file);
}

const testFiles = findTestFiles(process.cwd());

console.log(`\nFound ${green(testFiles.length)} test file(s)`);

for (const file of testFiles) {
  console.log(`\n${yellow(file)}\n`);

  transformFile(file);

  await import(path.resolve(file));

  const {passed, failed} = await jsTe.run();
  totalPassed += passed;
  totalFailed += failed;
}

restoreFiles();

console.log(getTestResultMsg(RESULT_TITLE.TOTAL, totalPassed, totalFailed));

if (totalFailed > 0) {
  process.exit(1);
}