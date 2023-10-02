'use strict';

import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import JSZip from 'jszip';
import { error } from 'console';

/**
 * Saves a folder as zip. Use fullpaths!
 * @param {string} pathToZip 
 * @param {string} saveAsFile 
 */
export async function zipFolder(pathToZip, saveAsFile) {
  let cwd = process.cwd();
  process.chdir(pathToZip);
  let zip = new JSZip();
  zip = await addToZip('.', zip);
  await zip.generateAsync({type:"blob"}).then(async function(content) {
    let readableStream = content.stream();
    let stream = readableStream.getReader();
    let writestream = fs.createWriteStream(saveAsFile);
    while (true) {
      let { done, value } = await stream.read();
      if (done) { break; }
      writestream.write(value);
    }
    writestream.close();
  });
  process.chdir(cwd);
}

async function addToZip(pathToZip, zip, recursive = true, indentation = '       ') {
  if (!fs.existsSync(pathToZip))
    throw error('   ! Invalid source path defined');
  for(const item of fs.readdirSync(pathToZip)) {
    var asset = path.join(pathToZip, item);
    var stat = fs.statSync(asset);
    if (stat.isDirectory() && recursive) {
      //console.log(indentation + '/' + asset);
      let zipped = zip.folder(asset);
      await addToZip(asset, zipped, recursive, indentation + '   ');
    }
    else if (stat.isFile()) {
      //console.log(indentation + '- ' + asset);
      var content = fs.readFileSync(asset);
      await zip.file(asset, content);
    }
  }
  return zip;
}

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
 * 
 * @param {source file} source 
 * @param {target file} target 
 * @param {boolean} overwrite target
 * @returns void
 */
export function copyFile(source, target, overwrite = false) {
  if (!fs.existsSync(source))
    throw error('   ! Invalid source path defined');
  if (fs.existsSync(source)) { if (!overwrite) return; }
  fs.copyFileSync(asset, file);
}

/**
 *
 * @param {string} source
 * @param {string} target
 */
export function cloneDirectories(source, target, recursive = true) {
  if (!fs.existsSync(source))
    throw error('   ! Invalid source path defined');
  for(const item of fs.readdirSync(source)) {
    var asset = path.join(source, item);
    var stat = fs.statSync(asset);
    if (stat.isDirectory() && recursive) {
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
export function writeYamlFile(filename, data) {
  fs.writeFileSync(filename, yaml.dump(data), 'utf8');
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
      break;
    case '.yaml':
      writeYamlFile(filename, data);
      break;
    default:
      throw error(`Invalid file type for ${filename} with ext '${path.extname(filename).toLowerCase()}'`);
  } 
}