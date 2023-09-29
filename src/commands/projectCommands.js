'use strict';

import CONFIG from '../config.js';
import moduleCommands from './moduleCommands.js';

class projectCommands {
  controller;
  
  /**
   * @param {commands} commands 
   */
  constructor(commands) {
    this.controller = CONFIG.projectController;
    this.load(commands);
  }

  /**
   * @param {commands} commands 
   */
  load(commands) {
    const cmdList = (commands['list']).command('project');
    cmdList
      .description('List the known projects')
      .action( async () => { await this.list(); });

    const cmdGet = (commands['get']).command('project');
    cmdGet
      .argument('<project>', 'Name of the project')
      .description('Display project information')
      .action( async (project) => { await this.get(project); });

    const cmdNew = (commands['new']).command('project');
    cmdNew
      .argument('<project>', 'Name of the project')
      .option('-f, --folder <target>', 'Selected parent path', CONFIG.currentWorkPath)
      .option('-t, --template <template>', 'Selected template', 'new-project')
      .description('Creates a new project')
      .action( async (project, options) => { await this.create(project, options); });

    const cmdAdd = (commands['add']).command('project');
    cmdAdd
      .argument('<project>', 'Name of the project')
      .option('-f, --folder <target>', 'Selected project path', CONFIG.currentWorkPath)
      .description('Add an existing project to the collection')
      .action( async (project, options) => { await this.add(project, options); });
    
    const cmdSet = (commands['set']).command('project');
    cmdSet
      .argument('<project>', 'Name of the project')
      .option('-f, --folder <target>', 'Selected project path', CONFIG.currentWorkPath)
      .description('Update project information')
      .action( async (project, options) => { await this.set(project, options); });

    const cmdDel = (commands['del']).command('project');
    cmdDel
      .argument('<project>', 'Name of the project')
      .description('Removes the project from the collection')
      .action( async (project) => { await this.remove(project); });
  }

  /**
   */
  async list() {
    console.log(`Retrieving projects from collection`);
    let values = await this.controller.list();
    this.printList(values);
  }

  /**
   * @param {string} project 
   */
  async get(project) {
    console.log(`Retrieving project ${project} from collection`);
    let value = await this.controller.get(project);
    if (value) {
      await CONFIG.setConfig({ project: value.name });
    }
    this.printValues(value, ` - WARNING: Project ${project} not found`);
    if (value) {
      let values = await CONFIG.moduleController.list({project: project});
      if (values && values.length > 0) {
        console.log(` - modules`);
        for (var member in values) {
          if (!values.hasOwnProperty(member) || typeof(values[member]) === "function") continue;
          console.log(`    - ${values[member].name}`);
        }
      }
    }
  }

  /**
   * @param {string} project 
   * @param {array} options 
   */
  async create(project, options) {
    console.log('Creating project ' + project + ' with template ' + options.template);
    options = this.controller.validate(project, options, true);
    console.log(' - template: ' + options.template);
    console.log(' - target: ' + options.folder);
    let value = await this.controller.create(project, options, true);
    if (value)
      await CONFIG.setConfig({ project: value.name });
    this.printValues(value, ` - WARNING: Project ${project} already exists`);
  }  

  /**
   * @param {string} project 
   * @param {array} options 
   */
  async add(project, options) {
    console.log(`Adding project ${project} to collection`);
    options = this.controller.validate(project, options, false);
    console.log(' - target: ' + options.folder);
    let value = await this.controller.create(project, options, false);
    if (value)
      await CONFIG.setConfig({ project: value.name });
    this.printValues(value, ` - WARNING: Project ${project} already exists`);
  }

  /**
   * @param {string} project 
   * @param {array} options 
   */
  async set(project, options) {
    console.log(`Updating project ${project} in collection`);
    options = this.controller.validate(project, options, false);
    let value = await this.controller.update(project, options);
    if (value)
      await CONFIG.setConfig({ project: value.name });
    this.printValues(value, ` - WARNING: Project ${project} does not exists`);
  }

  /**
   * @param {string} project 
   * @param {array} options 
   */
  async remove(project) {
    console.log('Removing project ' + project + ' from collection');
    let value = await this.controller.remove(project);
    if (value) {
      await CONFIG.setConfig({ project: '' });
      console.log(' - Project is removed from the collection');
    } else
      console.log(` - WARNING: Project ${project} does not exists`);
  }

  /**
   * @param {array} values
   */
  printList(values) {
    if (values && values.length>0) {
      for (var item in values) {
        console.log(` - ${values[item].name} \t\t (${values[item].path})`);
      }
    } else 
      console.log(` - No projects where found`);
  }

  /**
   * @param {array} value
   * @param {string} warning 
   */
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

export default projectCommands