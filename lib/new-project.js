/*
 * RPG TOOLS XYZ by Vincent Huybrechts
 *
 * Create. Give worldName and parentPath
 */
import path from 'path';

import { createFolder, readJsonFile, writeJsonFile } from './lib-utils.js';

// Creates the subfolders for a project
function createSubfolders(projectJSON, parent, folder) {
  let newPath = createFolder(parent, folder.name);
  console.log('   - creating subfolder for ' + folder.name);
  folder.folders.forEach(subfolder => { 
    createSubfolders(projectJSON, newPath, subfolder ) ;
  });
}

// Main procedure
export default async function newProject(projectName, projectPath) {
  console.log('Creating project ' + projectName + ' in ' + projectPath);
  
  console.log(' - reading default settings from "' + path.resolve('./settings.json') + '"');
  var settingsJSON = await readJsonFile(path.resolve('./settings.json'));

  console.log(' - building project settings');
  const projectJSON = settingsJSON.project.settings;
  projectJSON.name = projectName;
  projectJSON.title = projectName;

  console.log(' - creating project folders');
  projectPath = createFolder(projectPath, projectName);
  settingsJSON.project.folders.forEach(subfolder => { 
    createSubfolders(projectJSON, projectPath, subfolder );
  });

  console.log(' - writing project settings');
  writeJsonFile(projectPath, 'settings.json', projectJSON);

  console.log(' - project ' + projectName + ' created in ' + projectPath);
}
