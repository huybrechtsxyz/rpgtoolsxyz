'use strict';

import fs from 'fs';
import path from 'path';

import CONFIG from '../config.js';
import projectItem from '../items/projectItem.js';
import projectData from '../data/projectData.js';

import { createDirectory, cloneDirectories } from "../lib/filesystem.js";

class projectController {
  location;
  items;

  constructor(baseDir) {
    this.location = baseDir;
    this.items = new projectData(this.location);
  }

  async init() {
    await this.items.init();
  }

  async dispose() {
    if (this.items)
      this.items.dispose();
  }

  async create(name, options) {
    console.log('Creating project ' + name + ' with template ' + options.template);
    let template = path.resolve(path.join(this.location, 'assets', options.template));
    let target = path.resolve(options.folder);
    if (!fs.existsSync(template))
      throw error(`Invalid template for ${template}`);
    if (!fs.existsSync(target))
      throw error(`Invalid target for ${target}`);

    target = path.resolve(path.join(target, name));
    console.log(' - creating default project folders and files...');
    console.log(' - template: ' + template);
    console.log(' - target: ' + target);
    createDirectory(target);
    cloneDirectories(template, target);

    console.log(' - adding to project collection');
    await this.init();
    try {
      let value = await this.items.create(new projectItem(name, target));
      if (value) {
        CONFIG.setProject(value.name);
        for (var member in value) {
          if (!value.hasOwnProperty(member) || typeof(value[member]) === "function") continue;
          console.log(` - ${member}: ${value[member]}`);
        }
      } else
        console.log(` - WARNING: Project ${name} already exists!`);
    }
    catch(error) {
      console.log(` - ERROR: ${error}`);
    }
    await this.dispose();
  }

  async add(name, options) {
    let target = path.resolve(options.folder);
    console.log(`Adding project ${name}`);
    if (!fs.existsSync(target))
      throw error(`Invalid target for ${target}`);
    console.log(' - adding to collection');
    await this.init();
    let value = await this.items.create(new projectItem(name, target));
    if (value) {
      CONFIG.setProject(value.name);
      for (var member in value) {
        if (!value.hasOwnProperty(member) || typeof(value[member]) === "function") continue;
        console.log(` - ${member}: ${value[member]}`);
      }
    } else
      console.log(` - WARNING: Project ${name} already exists!`);
    await this.dispose;
  }

  async update(name, options) {
    let value = new projectItem(name, path.resolve(options.folder));
    console.log('Updating project ' + value.name);
    if (!fs.existsSync(value.path))
      throw error(`Invalid target for ${value.path}`);
    console.log(' - updating project collection');
    console.log(' - target: ' + value.path);
    await this.init();
    value = await this.items.update(value);
    if (value) {
      CONFIG.setProject(name);
      for (var member in value) {
        if (!value.hasOwnProperty(member) || typeof(value[member]) === "function") continue;
        console.log(` - ${member}: ${value[member]}`);
      }
    } else
      console.log(` - WARNING: Project ${name} does not exists!`);
    await this.dispose();
  }

  async remove(name) {
    console.log('Removing project ' + name);
    console.log(' - Removing project collection');
    await this.init();
    let result = await this.items.remove( new projectItem(name, ''));
    if (result) {
      CONFIG.setProject(null);
      console.log(' - Removed from collecion');
    }
    await this.dispose();
  }

  async list() {
    console.log(`Retrieving projects`);
    console.log(' - searching collection');
    await this.init();
    let values = await this.items.findMany({});
    if (values && values.length>0) {
      for (var item in values) {
        console.log(` - ${values[item].name} \t\t (${values[item].path})`);
      }
    } else 
      console.log(` - No projects where found`);
    await this.dispose();
  }

  async get(name) {
    console.log(`Retrieving project ${name}`);
    console.log(' - searching collection');
    await this.init();
    let value = await this.items.findOne(name);
    if (value) {
      CONFIG.setProject(value.name);
      for (var member in value) {
        if (!value.hasOwnProperty(member) || typeof(value[member]) === "function") continue;
        console.log(` - ${member}: ${value[member]}`);
      }
    } else
      console.log(` - WARNING: Project ${name} not found`);
    await this.dispose();
  }
}

export default projectController;