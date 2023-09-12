// Imports
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';

/**
 * @param {fs.PathLike} folder
 */
export function createDirectory(folder){
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  return folder;
}

/**
 * @param {string} sourcePath
 * @param {string} targetPath
 * @var {string} subPath
 */
export function copyDirectories(sourcePath, targetPath) {
  if (!fs.existsSync(sourcePath)) {
    console.log('   ! Invalid source path defined');
  }

  const items = fs.readdirSync(sourcePath);
  for(const itemname of items) {
    var fullPath = path.join(sourcePath, itemname);
    var stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      var subPath = createDirectory(path.join(targetPath,itemname));
      copyDirectories(fullPath, subPath);
    } else if (stat.isFile()) {
      var filePath = path.join(targetPath, itemname);
      if (!fs.existsSync(filePath)) {
        fs.copyFileSync(fullPath, filePath);
      }
    }
  }
}

// Read JSON file
/**
 * @param {string} fileName
 */
 export async function readJsonFile(fileName) {
  try {
    let fileJSON = JSON.parse(await fsp.readFile(new URL('file://' + fileName, import.meta.url), 'utf-8'));
    return fileJSON;
  }
  catch(e) {
    console.error(e);
  }
}

// Write JSON file
/**
 * @param {string} folder
 * @param {string} filename
 * @param {object} data
 */
export function writeJsonFile(folder, filename, data) {
  fs.writeFile(path.join(folder, filename), JSON.stringify(data), err => { if (err) { throw err } });
}

// Merge 2 Json Objects
export function mergeJsonData(data1, data2)
{
  return {...data1, ...data2};
}

// Read YAML file
/**
 * @param {string} fileName
 */
export function readYamlFile(filename) {
  let fileContents = fs.readFileSync(filename, 'utf8');
  let data = yaml.load(fileContents);
  return data;
}

// Write YAML file
/**
 * @param {string} folder
 * @param {string} filename
 * @param {object} data
 */
export function writeYamlFile(folder, filename, data) {
  let yamlData = yaml.dump(data);
  fs.writeFileSync(path.join(folder, filename), yamlData, 'utf8');
}