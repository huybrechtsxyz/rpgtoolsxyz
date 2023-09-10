// Imports
import path from 'path';
import {fileURLToPath} from 'url';
import { Command } from 'commander';
import { readJsonFile } from './lib-files.js';
import { newProject } from './new-project.js';
import { newModule } from './new-module.js';

// Read Package
const appPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)) + '/..');

// 
const packageFile = path.resolve(path.join(appPath, './package.json'));
console.log('Reading package configuration from...' + packageFile);
const packageData = async () => { await readJsonFile(packageFile) };

// Create command line interface
const program = new Command();
program
  .name(packageData.name)
  .version(packageData.version);

program
  .command('new-project <projectName> <projectPath>')
  .description('Creates a new project in the given folder')
  .action((projectName, projectPath) => { newProject(appPath, projectName, path.resolve(projectPath)) });

program
  .command('new-module <moduleName> <projectPath>')
  .description('Creates a new module for the given project')
  .action((moduleName, projectPath) => { newModule(appPath, moduleName, path.resolve(projectPath)) });

// Parse and execute commandline.
program.parse(process.argv)