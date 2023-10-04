#!/usr/bin/env node

import addNumbers from './index.js';

console.log(addNumbers(Number(process.argv[2]),Number(process.argv[3])));