'use strict';

class moduleItem {
  constructor(project = '', name = '') {
    this.project = project;
    this.name = name;
  }

  get key() { return { project: this.project, module: this.name }; };

  get key() { return this.name; }

  project;
  name;
}

export default moduleItem;