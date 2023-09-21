'use strict';

import config from '../config.js'
import collection from './collection.js';

class projectCollection extends collection {

  constructor(baseDir, load = false) {
    super(baseDir, config.projectDB);
    if (load) this.load();
  }

  async load() {
    super.load([{ fieldName: 'name', unique: true }]);
  }

  async create(item) {
    return super.create({ name: item.name }, item);
  }

  async update(item) {
    return super.update({ name: item.name }, { $set: { path: item.path } });
  }

  async remove(item) {
    return super.remove({ name: item.name }, item);
  }

  async find(query) {
    return super.find(query);
  }

  async findOne(query) {
    return super.findOne(query);
  }

  async findByName(item) {
    return super.findOne({ name: item });
  }  
}

export default projectCollection;