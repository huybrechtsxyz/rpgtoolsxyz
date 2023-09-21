'use strict';

import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import { error } from 'console';

/**
 * @param {fs.PathLike} folder
 */
export function createDirectory(folder) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  return folder;
}

/**
 * @param {string} source
 * @param {string} target
 */
export function cloneDirectories(source, target) {
  if (!fs.existsSync(source))
    throw error('   ! Invalid source path defined');
  for(const item of fs.readdirSync(source)) {
    var asset = path.join(source, item);
    var stat = fs.statSync(asset);
    if (stat.isDirectory()) {
      var newdir = createDirectory(path.join(target,item));
      cloneDirectories(asset, newdir);
    }
    else if (stat.isFile()) {
      var file = path.join(target, item);
      if (!fs.existsSync(file)) {
        fs.copyFileSync(asset, file);
      }
    }
  }
}

// Read JSON file
/**
 * @param {string} fileName
 */
export async function readJsonFile(fileName) {
  return JSON.parse(await fsp.readFile(new URL('file://' + fileName, import.meta.url), 'utf-8'));
}

// Write JSON file
/**
 * @param {string} filename
 */
export function writeJsonFile(filename, data) {
  fs.writeFile(filename, JSON.stringify(data), err => { if (err) { throw err; } });
}

// Read YAML file
/**
 * @param {string} fileName
 */
export function readYamlFile(filename) {
  return yaml.load(fs.readFileSync(filename, 'utf8'));
}

// Write YAML file
/**
 * @param {string} filename
 */
export function writeYamlFile(folder, filename, data) {
  fs.writeFileSync(path.join(folder, filename), yaml.dump(data), 'utf8');
}

// Read data file
/**
 * @param {string} filename
 */
export function readDataFile(filename) {
  switch(path.extname(filename).toLowerCase()) {
    case '.json':
      return readJsonFile(filename);
    case '.yaml':
      return readYamlFile(filename);
    default:
      throw error(`Invalid file type for ${filename}`);
  } 
}

// Write data file
/**
 * @param {string} filename
 * @param {object} data
 */
export function writeDataFile(filename, data) {
  switch(path.extname(filename).toLowerCase()) {
    case '.json':
      writeJsonFile(filename, data);
    case '.yaml':
      writeYamlFile(filename, data);
    default:
      throw error(`Invalid file type for ${filename}`);
  } 
}