// Imports
import fs from 'fs';
import path from 'path';
import { createDirectory, getFilename } from './lib-files.js';
import { inspect } from 'util';

/* Parameters for items
 * appPath
 * creature
 * options.kind
 * options.markup
 * options.path
 * options.template
 * options.source
 * options.copyof
 * options.force
 */

// BASIC ACTION TO CREATE A NEW ITEM
function newItem(appPath, appType, item, options) {

  console.log('Creating a new ' + appType + ' ' + item + ' with template ' + options.template );

  // TEMPLATE DIR
  let templatePath = path.resolve(path.join(appPath, 'assets', 'new-item', options.template));
  if (!fs.existsSync(templatePath)) {
    throw error(`Invalid template ${options.template} (${templatePath})`);
  }
  
  // REPO DIR
  let targetPath = createDirectory(path.resolve(path.join(options.path, 'repo')));

  // CREATURE DIR
  targetPath = path.resolve(path.join(targetPath, appType));
  if (!fs.existsSync(targetPath)) {
    if (options.force==false) {
      throw error(`Invalid repo ${appType} for ${targetPath}`);
    }
    createDirectory(targetPath);
  }

  // CREATURE | BEAST DIR
  targetPath = path.resolve(path.join(targetPath, options.kind));
  if (!fs.existsSync(targetPath)) {
    if (options.force==false) {
      throw error(`Invalid repo ${options.kind} for ${targetPath}`);
    }
    createDirectory(targetPath);
  }

  // CHECK SOURCE
  switch(options.source) {
    case null:
      console.log(` - creating default ${appType} file...`);
      break;
    case 'fvtt':
      console.log(` - creating ${appType} with ${copyof}...`);
      break;
    default:
      throw error(`Invalid source type ${source} [fvtt]`);
  }

  if (options.source != null && !fs.existsSync(options.copyof)) {
    throw error(`Invalid source ${options.source} (${options.copyof})`);
  }
  targetPath = path.join(targetPath, getFilename(item, options.markup));
  console.log(' - source  : ' + templatePath);
  console.log(' - target  : ' + targetPath);
  if (!fs.existsSync(targetPath) || (fs.existsSync(targetPath) && options.force == true)) {
    fs.copyFileSync(templatePath, targetPath);
  }
  
  return targetPath;
}

// CREATE A NEW CREATURE
export function newCreature(appPath, creature, options) {
  let targetFile = newItem(appPath, 'creature', creature, options);
  console.log('traverse the file');
}