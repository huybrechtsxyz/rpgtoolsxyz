'use-strict';

import Datastore from './lib/datastore.js';
import configController from './controllers/configController.js';
import projectController from './controllers/projectController.js';
import moduleController from './controllers/moduleController.js';

const CONFIG = {
  configDB: 'data/config.db',
  projectDB: 'data/projects.db',
  moduleDB: 'data/modules.db',

  assetsPath: 'assets',
  buildPath: 'bin',
  outputPath: 'dist',
  modulePath: 'mods',
  moduleFile: 'module.yaml',

  applicationPath: null,
  currentWorkPath: null,
  configController: null,
  projectController: null,

  async initialize(appPath, cwdPath) {
    this.applicationPath = appPath;
    this.currentWorkPath = cwdPath;

    this.configController = new configController(new Datastore(appPath, this.configDB));
    this.projectController = new projectController(new Datastore(appPath, this.projectDB));
    this.moduleController = new moduleController(new Datastore(appPath, this.moduleDB));
    
    await this.configController.initialize();
    await this.projectController.initialize();
    await this.moduleController.initialize();
  },

  async dispose() {
    await this.moduleController.dispose();
    await this.projectController.dispose();
    await this.configController.dispose();
    
    this.moduleController = null;
    this.projectController = null;
    this.configController = null;
  },

  async getConfig() {
    return await this.configController.read();
  },

  // { project: abc, module: def }
  async setConfig(options) {
    return await this.configController.save(options);
  }
}

export default CONFIG;