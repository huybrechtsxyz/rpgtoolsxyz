/*
 * RPG TOOLS XYZ by Vincent Huybrechts
 *
 * Utilities
 */
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';

import yaml from 'js-yaml';

// Create a path if it does not exists
export function createPath(folder) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  return folder;
}

// Create a path if it does not exists
export function createFolder(root, folder) {
  var fullPath = path.join(root, folder);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath);
  }
  return fullPath;
}

// Read JSON file
export async function readJsonFile(fileName) {
  let fileJSON = JSON.parse(await fsp.readFile(new URL('file://' + fileName, import.meta.url)));
  return fileJSON;
}

// Write JSON file
export function writeJsonFile(folder, filename, object) {
  fs.writeFile(path.join(folder, filename), JSON.stringify(object), err => { if (err) { throw err } });
}

// Read YAML file
export function readYamlFile(filename) {
  let fileContents = fs.readFileSync(filename, 'utf8');
  let data = yaml.load(fileContents);
  return data;
}

// Write YAML file
export function writeYamlFile(folder, filename, object) {
  let data = yaml.dump(object);
  fs.writeFileSync(path.join(folder, filename), data, 'utf8');
}
