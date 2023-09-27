'use strict';

import fs from 'fs';
import path from 'path';

import CONFIG from '../config.js';
import projectItem from '../items/projectItem.js';
import { createDirectory, cloneDirectories } from "../lib/filesystem.js";

class projectController {
  datastore;

  constructor(datastore) {
    this.datastore = datastore;
  }

  async initialize() {
    await this.datastore.open();
  }
  
  async dispose() {
    await this.datastore.close();
  }

  async list() {
    return await this.datastore.findAll();
  }
 
  async get(key) {
    return await this.datastore.findOne(key);
  }

  validate(name, options, makeFolder = false) {
    if (options) {
      if (options.template) {
        options.template = path.resolve(path.join(CONFIG.applicationPath, 'assets', 'projects', options.template));
        if (!fs.existsSync(options.template))
          throw error(`Invalid project template for ${options.template}`);
      }
      if (options.folder) {
        options.folder = path.resolve(options.folder);
        if (!fs.existsSync(options.folder))
          throw error(`Invalid target for ${options.folder}`);
        if (makeFolder)
          options.folder = path.resolve(path.join(options.folder, name));
      }
    }
    return options;
  }

  async create(name, options, makeFolder = false) {
    if (makeFolder) {
      createDirectory(options.folder);
      cloneDirectories(options.template, options.folder);
    }
    let item = new projectItem(name, options.folder);
    return await this.datastore.create(item.key, item);
  }

  async update(name, options) {
    let item = new projectItem(name, options.folder);
    return item = await this.datastore.modify(item.key, item);
  }

  async remove(name) {
    return await this.datastore.remove(new projectItem(name).key);
  }
}

export default projectController;