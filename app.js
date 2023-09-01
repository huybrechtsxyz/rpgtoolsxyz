/*
 * RPG TOOLS XYZ by Vincent Huybrechts
 *
 * Create. Give worldName and parentPath
 */
import path from 'path';

import { readJsonFile } from './lib/lib-utils.js';
import newProject from './lib/new-project.js';
import newModule from './lib/new-module.js';

// Read Package
const packageJSON = await readJsonFile(path.resolve('./package.json'));

// Create command line interface
import { Command } from 'commander';
const program = new Command();
program
  .name(packageJSON.name)
  .version(packageJSON.version)
  .description(packageJSON.description)

program
  .command('new-project <projectName> <projectPath>')
  .description('Creates a new project in the given folder')
  .action((projectName, projectPath) => { newProject(projectName, path.resolve(projectPath)) });

program
  .command('new-module <moduleName> <projectPath>')
  .description('Creates a new module in the given project')
  .action((moduleName, projectPath) => { newModule(moduleName, path.resolve(projectPath)) });

// Parse and execute commandline.
program.parse(process.argv)
