'use strict';

import CONFIG from '../config.js'
import Data from '../data.js'

class projectData {
  dataset;

  constructor(baseDir) {
    this.dataset = new Data(baseDir, CONFIG.projectDB);
  }

  async init() {
    await this.dataset.open();
  }

  async dispose() {
    if (this.dataset.isOpen())
      await this.dataset.close();
  }
  
  async findOne(name) {
    return await this.dataset.findOne(name);
  }

  async findMany(filter) {
    return await this.dataset.findMany(filter);
  }

  async create(item) {
    let value = await this.dataset.create(item.name, item);
    if (value)
      return value;
    else
      return null;
  }

  async update(item) {
    let value = await this.dataset.findOne(item.name);
    if (value) {
      value.path = item.path;
      await this.dataset.update(value.name, value);
      return value;
    } else
      return null;
  }

  async remove(item) {
    return this.dataset.remove(item.name);
  }
}

export default projectData;