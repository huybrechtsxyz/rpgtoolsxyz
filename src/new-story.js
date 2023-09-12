// Imports
import fs from 'fs';
import path from 'path';
import { createDirectory, copyDirectories, readYamlFile, writeYamlFile } from './lib-files.js';

export function newStory(appPath, projectPath, storyName) {
  console.log('Creating a new story (campaign)' );
  let assetPath = path.resolve(path.join(appPath, 'assets', 'new-story'));
  
  if (!fs.existsSync(projectPath)) {
    console.error('Invalid project path for ' + projectPath);
    exit();
  }

  let rootPath = createDirectory(path.resolve(path.join(projectPath, 'stories')));
  rootPath = createDirectory(path.resolve(path.join(rootPath, storyName)));
  console.log(' - creating story ' + storyName + ' in ' + projectPath);
  console.log(' - creating default story folders and files');
  console.log(' - creating story path ' + rootPath);
  createDirectory(rootPath);

  console.log(' - creating story assets from ' + assetPath);
  copyDirectories(assetPath, rootPath);
  console.log(' - created story assets in ' + rootPath);
}