/*
 * RPG TOOLS XYZ by Vincent Huybrechts
 *
 * Create. Give moduelName and projectPath
 */
import fs from 'fs';
import path from 'path';
import { inspect } from 'util';

import { createFolder, createPath, readJsonFile, readYamlFile, writeYamlFile } from './lib-utils.js';

// Creates the subfolders for a module
function createSubfolders(projectJSON, root, folder) {
  console.log('   - creating folder for ' + folder.name);
  let newPath = createFolder(root, folder.name);

  console.log('   - creating files for ' + folder.name);
  folder.files.forEach(fileItem => {
    if (!fs.existsSync(path.resolve(path.join(newPath, path.basename(fileItem))))) {
      fs.copyFileSync(path.resolve(path.join('.', fileItem)),path.resolve(path.join(newPath,path.basename(fileItem))));
    }
  });
  
  folder.folders.forEach(subfolder => { 
    createSubfolders(projectJSON, newPath, subfolder ) ;
  });
}

// Main procedure
export default async function newModule(moduleName, projectPath) {
  console.log('Creating module ' + moduleName + ' in ' + projectPath);
  let modulePath = createPath(path.join(projectPath, 'mods', moduleName));
  console.log(' - path for module is ' + modulePath);

  console.log(' - reading default settings from ' + path.resolve('./settings.json'));
  let settingsJSON = await readJsonFile(path.resolve('./settings.json'));

  console.log(' - reading project settings from ' + path.join(projectPath, 'settings.json'));
  let projectJSON = await readJsonFile(path.join(projectPath, 'settings.json')); 

  //console.log(' - building module settings');
  //const moduleJSON = settingsJSON.module.settings;

  console.log(' - building module configuration');
  if (!fs.existsSync(path.resolve(path.join('.', 'module.yaml')))) {
    fs.copyFileSync(path.resolve(path.join('.', 'module.yaml')),path.resolve(path.join(modulePath,'module.yaml')));
  }
  const moduleYAML = readYamlFile(path.resolve(path.join(modulePath, './module.yaml')));
  moduleYAML.module.id = moduleName;

  console.log(' - creating module folders');
  settingsJSON.module.folders.forEach(subfolder => { 
    createSubfolders(projectJSON, modulePath, subfolder );
  });

  console.log(' - writing module configuration');
  writeYamlFile(modulePath, 'module.yaml', moduleYAML);

  console.log(' - module ' + moduleName + ' created in ' + projectPath);
}
