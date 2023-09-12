// Imports
import path from 'path';
import { fileURLToPath } from 'url';
import { Command } from 'commander';
import { readJsonFile } from './lib-files.js';
import { newProject } from './new-project.js';
import { newModule } from './new-module.js';
import { newStory } from './new-story.js';

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
  .command('new-project <projectPath> [projectName]')
  .description('Creates a new project in the given folder')
  .action((projectPath, projectName) => { newProject(appPath, path.resolve(projectPath), projectName) });

program
  .command('new-module <projectPath> <moduleName>')
  .description('Creates a new module for the given project')
  .action((projectPath, moduleName) => { newModule(appPath, path.resolve(projectPath), moduleName) });

program
  .command('new-story <projectPath> <storyName>')
  .description('Creates a new story (campaign) for the given project')
  .action((projectPath, storyName) => { newStory(appPath, path.resolve(projectPath), storyName) });

// Parse and execute commandline.
program.parse(process.argv)