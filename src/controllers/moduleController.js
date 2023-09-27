'use strict';

import fs from 'fs';
import path from 'path';
import jslinq from 'jslinq';

import CONFIG from '../config.js';
import projectItem from '../items/projectItem.js';
import moduleItem from '../items/moduleItem.js';
import { createDirectory, cloneDirectories } from "../lib/filesystem.js";

class moduleController {
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

  async list(options) {
    let items = await this.datastore.findAll();
    let project = await this.getProjectName(options);

    if (items && items.length>0) {
      items = await this.applyFilter(jslinq(items), project);
      return items;
    }
    return null;
  }

  async get(name, options) {
    let project = await this.getProjectName(options);
    let item = new moduleItem(project, name);
    return await this.datastore.findOne(item.key);
  }

  async validate(name, options, makeFolder = false) {
    options.project = await this.getProjectName(options);
    if (!options.project)
      throw error(`Invalid project selected`);

    let project = await CONFIG.projectController.get(new projectItem(options.project).key);
    if (!project)
      throw error(`Invalid project ${options.project} selected`);

    if (options && options.template) {
      options.template = path.resolve(path.join(CONFIG.applicationPath, 'assets', 'modules', options.template));
      if (!fs.existsSync(options.template))
        throw error(`Invalid module template for ${options.template}`);
    }

    if (!fs.existsSync(project.path))
      throw error(`Invalid project ${project.name} target for ${project.path}`);

    options.folder = path.resolve(path.join(project.path, 'mods'));
    if (!fs.existsSync(options.folder)) {
      if (makeFolder)
        createDirectory(options.folder);
      else
        throw error(`Invalid module ${name} folder for ${options.folder}`);
    }

    options.folder = path.join(options.folder, name);
    if (!fs.existsSync(options.folder)) {
      if (makeFolder)
        createDirectory(options.folder);
      else 
        throw error(`Invalid module ${name} target for ${options.folder}`);
    }

    return options;
  }

  async create(name, options, makeFolder = false) {
    if (makeFolder) {
      createDirectory(options.folder);
      cloneDirectories(options.template, options.folder);
    } 
    let item = new moduleItem(options.project, name);
    return await this.datastore.create(item.key, item);
  }

  async update(name, options) {
    let item = new moduleItem(options.project, name);
    return await this.datastore.update(item.key, item);
  }

  async remove(name, options) {
    let item = new moduleItem(options.project, name);
    return await this.datastore.remove(item.key);
  }

  async applyFilter(queryObj, project) {
    if (project)
      return queryObj.where(function(element) { return element.project == project; }).toList();
    else
      return queryObj.toList();
  }

  async getProjectName(options) {
    if (options && options.project && options.project != '')
      return options.project;
    let value = await CONFIG.getConfig();
    if (value && value.project && value.project != '')
      return value.project;
    return null;
  }

}

export default moduleController;