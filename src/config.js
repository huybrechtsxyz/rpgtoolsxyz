'use-strict';

import Data from './data.js';

class configItem {
  name;
  project;
}

const CONFIG = {
  configDB: 'data/config.db',
  projectDB: 'data/projects.db',
  moduleDB: 'data/modules.db',

  id_defaults: 'defaults',

  baseDir: '',
  
  async init(baseDir) {
    this.baseDir = baseDir;
    this.data = new Data(baseDir, this.configDB);
    await this.data.open();
    this.defaults = await this.data.findOne(this.id_defaults);
    if (this.defaults) {}
    else {
      this.defaults = new configItem();
      this.defaults.name = this.id_defaults;
      this.defaults.project = '';
      await this.data.create(this.id_defaults, this.defaults);
    }
  },

  async dispose() {
    if (this.data.isOpen()) {
      this.data.close();
    }
  },

  async getProject() {
    if (this.defaults)
      return this.defaults.project;

    await this.init(this.baseDir);
    this.defaults = await this.data.findOne(this.id_defaults);
    return this.defaults.project;
  },

  async setProject(project) {
    if (this.defaults.project == project)
      return;

    await this.init(this.baseDir);
    await this.data.update(this.id_defaults, this.defaults);
    await this.dispose();
  }
}

export default CONFIG;