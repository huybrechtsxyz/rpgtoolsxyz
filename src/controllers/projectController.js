'use strict';

import fs from 'fs';
import path from 'path';

import projectItem from '../items/projectItem.js';
import projectCollection from '../collections/projectCollection.js';
import { createDirectory, cloneDirectories } from "../lib/filesystem.js";

class projectController {
  baseDir;
  collection;

  constructor(baseDir) {
    this.baseDir = baseDir;
    this.collection = new projectCollection(baseDir, true);
  }

  async create(name, target, template) {
    console.log('Creating project ' + name + ' with template ' + template);
    template = path.resolve(path.join(this.baseDir, 'assets', template));
    target = path.resolve(target);
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
    let object = new projectItem()
      object.name = name;
      object.path = target;
    let item = await this.collection.create(object);
    if (item) {
      for (var member in item) {
        if (!item.hasOwnProperty(member) || typeof(item[member]) === "function") continue;
        console.log(` - ${member}: ${item[member]}`);
      }
    } else
      console.log(` - WARNING: Project ${name} already exists!`);
  }

  async add(name, target) {
    target = path.resolve(target);
    console.log(`Adding project ${name}`);
    if (!fs.existsSync(target))
      throw error(`Invalid target for ${target}`);
    console.log(' - adding to collection');
    let item = await this.collection.create({ name: name, path: target });
    if (item) {
      for (var member in item) {
        if (!item.hasOwnProperty(member) || typeof(item[member]) === "function") continue;
        console.log(` - ${member}: ${item[member]}`);
      }
    } else
      console.log(` - WARNING: Project ${name} already exists!`);
  }

  async update(name, options) {
    let project = new projectItem();
    project.name = name;
    project.path = path.resolve(options.path);
    
    console.log('Updating project ' + project.name);
    if (!fs.existsSync(project.path))
      throw error(`Invalid target for ${project.path}`);
    console.log(' - updating project collection');
    console.log(' - target: ' + project.path);
    let item = await this.collection.update(project);
    if (item) {
      for (var member in item) {
        if (!item.hasOwnProperty(member) || typeof(item[member]) === "function") continue;
        console.log(` - ${member}: ${item[member]}`);
      }
    } else
      console.log(` - WARNING: Project ${name} does not exists!`);
  }

  async remove(project) {
    console.log('Removing project ' + project);
    console.log(' - Removing project collection');
    let result = await this.collection.remove({ name: project });
    if (result)
    console.log(' - Removed from collecion');
  }

  async list() {
    console.log(`Retrieving projects`);
    console.log(' - searching collection');
    let items = await this.collection.find({});
    if (items && items.length>0) {
      for (var item in items) {
        console.log(` - ${items[item].name} \t\t (${items[item].path})`);
      }
    } else 
      console.log(` - No projects where found`);
  }

  async get(name) {
    console.log(`Retrieving project ${name}`);
    console.log(' - searching collection');
    let item = await this.collection.findOne({ name: name });
    if (item) {
      for (var member in item) {
        if (!item.hasOwnProperty(member) || typeof(item[member]) === "function") continue;
        console.log(` - ${member}: ${item[member]}`);
      }
    } else
      console.log(` - WARNING: Project ${name} not found`);
  }
}

export default projectController;