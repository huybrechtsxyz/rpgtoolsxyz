'use strict';

import path from 'path';
import CONFIG from '../config.js';

import projectItem from '../items/projectItem.js';
import moduleItem from '../items/moduleItem.js';
import { copyFile, cloneDirectories, zipFolder } from "../lib/filesystem.js";

class moduleBuilderFoundry {

  /**
   * 
   * @param {projectItem} project 
   * @param {moduleItem} module 
   * @param {string} buildPath (obj)
   * @param {string} outputPath (dist)
   * @param {string} modulePath (mods)
   */
  async beforeBuild(
    project,
    module,
    buildPath,
    outputPath,
    modulePath
  ) {
    // Copy packs FOUNDRY to MODS
    cloneDirectories(path.join(module.path,'packs'), path.join(modulePath,'packs'));
  }

  /**
   * 
   * @param {projectItem} project 
   * @param {moduleItem} module 
   * @param {string} buildPath (obj)
   * @param {string} outputPath (dist)
   * @param {string} modulePath (mods)
   */
  async createBuild(
    project,
    module,
    buildPath,
    outputPath,
    modulePath
  ) {
    // Copy packs MODS to OBJ 
    cloneDirectories(path.join(modulePath,'packs'), path.join(buildPath,'packs'));

    // Copy assets MODS to OBJ
    cloneDirectories(path.join(modulePath, 'assets'), buildPath);
  }
    
  /**
     * 
     * @param {projectItem} project 
     * @param {moduleItem} module 
     * @param {string} buildPath (obj)
     * @param {string} outputPath (dist)
     * @param {string} modulePath (mods)
     */
  async postBuild(
    project,
    module,
    buildPath,
    outputPath,
    modulePath
  ) {
    // Copy assets OBJ to FOUNDRY
    cloneDirectories(path.join(buildPath), module.path);
  }

  /**
   * 
   * @param {projectItem} project 
   * @param {moduleItem} module 
   * @param {string} buildPath (obj)
   * @param {string} outputPath (dist)
   * @param {string} modulePath (mods)
   */
  async createOutput(
    project,
    module,
    buildPath,
    outputPath,
    modulePath
  ) {
    await zipFolder(
      path.join(project.path, CONFIG.buildPath, module.name),
      path.join(project.path, CONFIG.outputPath, module.name)
    );
    copyFile(
      path.join(project.path, CONFIG.buildPath, "module.json"),
      path.join(project.path, CONFIG.outputPath, "module.json")
    );
  }
}

export default moduleBuilderFoundry;