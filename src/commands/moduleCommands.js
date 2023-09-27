'use strict';

import CONFIG from '../config.js';

class moduleCommands {
  controller;
  
  constructor(commands) {
    this.controller = CONFIG.moduleController;
    this.load(commands);
  }

  load(commands) {
    const cmdList = (commands['list']).command('module');
    cmdList
      .option('-p, --project <project>', 'Selected project')
      .description('List the known modules (for a project)')
      .action( async (options) => { await this.list(options); });

    const cmdGet = (commands['get']).command('module');
    cmdGet
      .argument('<module>', 'Name of the module')
      .option('-p, --project <project>', 'Selected project')
      .description('Display module information')
      .action( async (module, options) => { await this.get(module, options); });

    const cmdNew = (commands['new']).command('module');
    cmdNew
      .argument('<module>', 'Name of the module')
      .option('-p, --project <project>', 'Selected project')
      .option('-t, --template <template>', 'Selected template', 'new-module')
      .description('Creates a new module for the selected project')
      .action( async (module, options) => { await this.create(module, options); });

    const cmdAdd = (commands['add']).command('module');
    cmdAdd
      .argument('<module>', 'Name of the module')
      .option('-p, --project <project>', 'Selected project')
      .description('Add an existing module to the project')
      .action( async (module, options) => { await this.add(module, options); });

    const cmdSet = (commands['set']).command('module');
    cmdSet
      .argument('<module>', 'Name of the module')
      .option('-p, --project <project>', 'Selected project')
      .description('Update module information')
      .action( async (module, options) => { await this.set(module, options); });

    const cmdDel = (commands['del']).command('module');
    cmdDel
      .argument('<module>', 'Name of the module')
      .option('-p, --project <project>', 'Selected project')
      .description('Removes the module from the project')
      .action( async (module, options) => { await this.remove(module, options); });
  }

  async list(options) {
    console.log(`Retrieving modules from collection`);
    let values = await this.controller.list(options);
    this.printList(values);
  }

  async get(module, options) {
    console.log(`Retrieving module ${module} from collection`);
    let value = await this.controller.get(module, options);    
    if (value)
      await CONFIG.setConfig({ project: value.project, module: value.name });
    this.printValues(value, ` - WARNING: Module ${module} for ${await this.controller.getProjectName(options)} not found`);
  }

  async create(module, options) {
    console.log('Creating module ' + module + ' with template ' + options.template);
    options = await this.controller.validate(module, options, true);
    console.log(' - project: ' + options.project);
    console.log(' - target: ' + options.folder);
    let value = await this.controller.create(module, options, true);
    if (value)
      await CONFIG.setConfig({ project: value.project, module: value.name });
    this.printValues(value, ` - WARNING: Module ${module} for project ${options.project} already exists`);
  }

  async add(module, options) {
    console.log('Adding module ' + module + ' to collection');
    options = await this.controller.validate(module, options, false);
    console.log(' - project: ' + options.project);
    console.log(' - target: ' + options.folder);
    let value = await this.controller.create(module, options, false);
    if (value)
      await CONFIG.setConfig({ project: value.project, module: value.name });
    this.printValues(value, ` - WARNING: Module ${module} for project ${options.project} already exists`);
  }

  async set(module, options) {
    console.log('Updating module ' + module + ' in collection');
    options = await this.controller.validate(module, options, false);
    let value = await this.controller.update(module, options);
    if (value)
      await CONFIG.setConfig({ project: value.name, module: value.name });
    this.printValues(value, ` - WARNING: Module ${module} for project ${options.project} does not exists`);
  }

  async remove(module, options) {
    console.log('Removing module ' + module + ' from collection');
    let value = await this.controller.remove(module, options);
    if (value)
      await CONFIG.setConfig({ project: value.name, module: value.name });
    this.printValues(value, ` - WARNING: Module ${module} for project ${options.project} does not exists`);
  }

  printList(values) {
    if (values && values.length>0) {
      for (var item in values) {
        console.log(` - ${values[item].name} \t\t (${values[item].project})`);
      }
    } else 
      console.log(` - No modules where found`);
  }

  printValues(value, warning) {
    if (value) {
      for (var member in value) {
        if (!value.hasOwnProperty(member) || typeof(value[member]) === "function") continue;
        console.log(` - ${member}: ${value[member]}`);
      }
    } else
      console.log(warning);
  }

}

export default moduleCommands;