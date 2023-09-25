'use strict';

import configItem from '../items/configItem.js';
import configCollection from '../collections/configCollection.js';
import { error } from 'console';

class configController {
  static baseDir;
  static collection;
  static defaults;

  _id_defaults = 'defaults';

  constructor(baseDir) {
    if (!this.baseDir)
      this.baseDir = baseDir;
    
  }

  async initialize() {
    if (!this.collection)
      this.collection = new configCollection(baseDir, true);
    if (!this.defaults)
      this.defaults = await this.collection.findByName(_id_defaults);
    if (!this.defaults) {
      this.defaults = new configItem();
      this.defaults.project = null;
      this.defaults = await this.collection.create(item);
    }
  }

  async getProject()
  {
    await this.initialize();
    return this.defaults.project;
  }

  async setProject(project)
  {
    await this.initialize();
    this.defaults.project = project;
    this.defaults = await this.collection.update(this.defaults, { $set: { project: this.defaults.project }});
  }
}

export default configController;