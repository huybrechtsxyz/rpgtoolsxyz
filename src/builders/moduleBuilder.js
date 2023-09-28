'use strict';

import fs from 'fs';

import CONFIG from '../config.js';
import { createDirectory, cloneDirectories, readDataFile, writeDataFile } from "../lib/filesystem.js";
import { error } from 'console';
import projectItem from '../items/projectItem.js';
import moduleItem from '../items/moduleItem.js';
import { create } from 'domain';
import path from 'path';

class moduleBuilder {
  project;
  module;
  builder;

  /**
   * 
   * @param {projectItem} project 
   * @param {moduleItem} module 
   * @param {Array} options 
   */
  constructor(project, module, options) {
    this.project = project;
    this.module = module;

    if (options && options.vtt && options.vtt != '') {
      this.module.vtt = options.vtt;
      this.module.path = options.location;
    }
  }

  /**
   * 
   */
  async build() {
    // Create builder if needed
    if (this.module.vtt != '') {
      switch(this.module.vtt) {
        case 'foundry': this.builder = new moduleBuilderFoundry();
      }

      if (!this.module.path || this.module.path == '' || !fs.existsSync(this.module.path))
        throw error(`Invalid location ${this.module.path} for ${this.module.vtt}`);
    }

    // Does module location exists?
    createOutputDirectories(project);
    let buildPath = path.resolve(path.join(project.path,CONFIG.buildPath,module.name));     // project/obj/module
    let outputPath = path.resolve(path.join(project.path,CONFIG.outputPath,module.name));   // project/dist/module
    let modulePath = path.resolve(path.join(project.path,CONFIG.modulePath,module.name));   // project/mods/module
    
    // Read module configuration
    let moduleData = await readDataFile(path.resolve(path.join(modulePath, CONFIG.moduleFile)));
    console.log(` - Building module ... ${moduleData.id} (${moduleData.version})`);
    moduleVersion = increaseVersion(moduleData.version, options);
    if (moduleData.version != moduleVersion) {
      console.log(` - Building module ... updating version to '${moduleVersion}'`);
    }

    // Write new module configuration
    if (moduleData.version != moduleVersion) {
      writeDataFile(path.resolve(path.join(modulePath, CONFIG.moduleFile)));
    }

    // Actions for VTT BEFORE
    if (this.builder)
      this.builder.beforeBuild(project,module,assetsPath,buildPath,outputPath,modulePath);
      
    
    // Actions for VTT POST
    if (this.builder)
      this.builder.createBuild(project,module,buildPath,outputPath,modulePath);

    // Actions for VTT POST
    if (this.builder)
      this.builder.postBuild(project,module,buildPath,outputPath,modulePath);

    // Actions for OUTPUT
    if (this.builder)
      this.builder.createOutput(project,module,buildPath,outputPath,modulePath);
  }

  /**
   * Builds the build and output paths for the module
   * @param {projectItem} project 
   * @param {moduleItem} module 
   */
  createOutputDirectories(project, module) {
    let outputPath = path.resolve(path.join(project.path,CONFIG.modulePath,module.name));
    if (!fs.existsSync(outputPath))
      throw error(`Invalid path ${modulePath} for module ${module.name}`);

    // Build path
    outputPath = path.join(project.path, CONFIG.buildPath);
    if (!fs.existsSync(outputPath))
      createDirectory(outputPath);

    // Build path module
    outputPath = path.join(outputPath, module.name);
    if (!fs.existsSync(outputPath))
      createDirectory(outputPath);

    // Dist path
    outputPath = path.join(project.path, CONFIG.outputPath);
    if (!fs.existsSync(outputPath))
      createDirectory(outputPath);

    // Dist path module
    outputPath = path.join(outputPath, module.name);
    if (!fs.existsSync(outputPath))
      createDirectory(outputPath);
  }

  /**
   * 
   * @param {string} semver 
   * @param {Array} options 
   * @returns the new semver
   */
  increaseVersion(semver, options) {
    if (options && options.version && options.version != '') {
      let versions = semver.split(".");
      if (options.version.toLowerCase() == 'build') {
        versions[2] = Number(versions[2]) + 1;
      } else if (options.version.toLowerCase() == 'minor') {
        versions[1] = Number(versions[1]) + 1;
        versions[2] = 1;
      } else if (options.version.toLowerCase() == 'major') {
        versions[0] = Number(versions[0]) + 1;
        versions[1] = 1;
        versions[2] = 1;
      }
      if ((options.version.toLowerCase() == 'build')
      || (options.version.toLowerCase() == 'minor')
      || (options.version.toLowerCase() == 'major')) {
        semver = versions.join(".")
      }
    }
    return semver;
  }
}

export default moduleBuilder;