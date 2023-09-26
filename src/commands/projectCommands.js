'use strict';

import projectController from '../controllers/projectController.js';

class projectCommands {
  controller;

  constructor(commands, baseDir, cwdPath) {
    this.controller = new projectController(baseDir)
    this.load(commands, cwdPath);
  }

  load(commands, cwdPath) {
    const cmdList = (commands['list']).command('project');
    cmdList
      .description('Lists the current projects')
      .action(() => { this.controller.list(); });

    const cmdGet = (commands['get']).command('project');
    cmdGet
      .argument('<project>', 'Name for the project.')
      .description('Get the information about the project')
      .action((project) => { this.controller.get(project); });

    const cmdNew = (commands['new']).command('project');
    cmdNew
      .argument('<project>', 'Name for the project.')
      .option('-f, --folder <target>', 'Path where to create the project', cwdPath)
      .option('-t, --template <template>', 'Template for creating project', 'new-project')
      .description('Create a new project in the given path\project')
      .action( (project, options) => { this.controller.create(project, options); });

    const cmdAdd = (commands['add']).command('project');
    cmdAdd
      .argument('<project>', 'Name for the project.')
      .option('-f, --folder <target>', 'Path where to create the project', cwdPath)
      .description('Add an existing project with the given path')
      .action((project, options) => { this.controller.add(project, options) });

    const cmdSet = (commands['set']).command('project');
    cmdSet
      .argument('<project>', 'Name for the project.')
      .option('-f, --folder <target>', 'Path of the project', cwdPath)
      .description('Updates the information of a project')
      .action((project, options) => { this.controller.update(project, options); });

    const cmdDel = (commands['del']).command('project');
    cmdDel
      .argument('<project>', 'Name for the project.')
      .description('Removes the project from the collection but does not delete any files or folders.')
      .action((project) => { this.controller.remove(project); });
  }
}

export default projectCommands 