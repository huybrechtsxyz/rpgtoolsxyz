// Imports
import path from 'path';
import { createDirectory, copyDirectories, readJsonFile, writeJsonFile, readYamlFile, writeYamlFile } from './lib-files.js';

export async function newProject(appPath, projectName, projectPath) {
  console.log('Creating a new project' );
  let assetPath = path.resolve(path.join(appPath, 'assets', 'new-project'));
  let rootPath = path.resolve(path.join(projectPath, projectName));
  let settingsFile = path.resolve(path.join(rootPath, './settings.json'));

  console.log(' - Creating project ' + projectName + ' in ' + projectPath);
  console.log(' - creating default project folders and files');
  console.log(' - creating project path ' + rootPath);
  createDirectory(rootPath);
  console.log(' - creating project assets from ' + assetPath);
  copyDirectories(assetPath, rootPath);

  console.log(' - initializing default settings ' + settingsFile);
  let settingsData = await readJsonFile(settingsFile);
  settingsData.settings.name = projectName;
  settingsData.settings.title = projectName;
  writeJsonFile(rootPath, 'settings.json', settingsData); 
  console.log(' - saving default settings "' + settingsFile + '"');
}