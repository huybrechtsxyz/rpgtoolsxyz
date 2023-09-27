'use strict';

import path from 'path';
import figlet from 'figlet';
import { fileURLToPath } from 'url';
import { Command } from 'commander';

import CONFIG from './config.js';
import { readJsonFile } from './lib/filesystem.js';

import configCommands from './commands/configCommands.js';
import projectCommands from './commands/projectCommands.js';
import moduleCommands from './commands/moduleCommands.js';

// Read Package
const cwdPath = process.cwd();
const appPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)) + '/..');
const packageFile = path.resolve(path.join(appPath, './package.json'));
const packageData = await readJsonFile(packageFile);
console.log(figlet.textSync(packageData.title));
console.log('Description: ' + packageData.description);
console.log(' - Work path: ' + cwdPath);
console.log(' - App path: ' + appPath);
console.log('');

// Create command line interface
await CONFIG.initialize(appPath, cwdPath);

const program = new Command();
program
  .name(packageData.name)
  .version(packageData.version);

let commands = {
  new: program.command('new'),
  add: program.command('add'),
  del: program.command('remove'),
  list: program.command('list'),
  get: program.command('get'),
  set: program.command('set'),
  sync: program.command('sync')
};

let subcommands = {
  config: new configCommands(commands),
  project: new projectCommands(commands, appPath, cwdPath),
  module: new moduleCommands(commands, appPath, cwdPath)
}

// Parse and execute commandline.
await program.parseAsync(process.argv)
console.log('');
await CONFIG.dispose();
