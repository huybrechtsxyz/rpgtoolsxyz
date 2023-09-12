// Imports
import fs from 'fs';
import path from 'path';
import { createDirectory, copyDirectories, readYamlFile, writeYamlFile } from './lib-files.js';

export function newModule(appPath, projectPath, moduleName) {
  console.log('Creating a new module' );
  let assetPath = path.resolve(path.join(appPath, 'assets', 'new-module'));
  
  if (!fs.existsSync(projectPath)) {
    console.error('Invalid project path for ' + projectPath);
    exit();
  }

  let rootPath = createDirectory(path.resolve(path.join(projectPath, 'mods')));
  rootPath = createDirectory(path.resolve(path.join(rootPath, moduleName)));
  console.log(' - creating module ' + moduleName + ' in ' + projectPath);
  console.log(' - creating default module folders and files');
  console.log(' - creating module path ' + rootPath);
  createDirectory(rootPath);

  console.log(' - creating module assets from ' + assetPath);
  copyDirectories(assetPath, rootPath);
  console.log(' - created module assets in ' + rootPath);

  let moduleFile = path.resolve(path.join(rootPath, './module.yaml'));
  console.log(' - initializing default settings "' + moduleFile + '"');
  let moduleData = readYamlFile(moduleFile);
  moduleData.module.id = moduleName;
  moduleData.module.title = moduleName;
  writeYamlFile(rootPath, 'module.yaml', moduleData);
}