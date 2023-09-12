// Imports
import path from 'path';
import { createDirectory, copyDirectories } from './lib-files.js';

export function newProject(appPath, projectPath, projectName) {
  console.log('Creating a new project' );
  let assetPath = path.resolve(path.join(appPath, 'assets', 'new-project'));
  let rootPath = path.resolve(path.join(projectPath, projectName));

  console.log(' - Creating project ' + projectName + ' in ' + projectPath);
  console.log(' - creating default project folders and files');
  console.log(' - creating project path ' + rootPath);
  createDirectory(rootPath);
  console.log(' - creating project assets from ' + assetPath);
  copyDirectories(assetPath, rootPath);
}