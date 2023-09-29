'use strict';

import CONFIG from '../config.js';
import { error } from 'console';

class projectBuilder {
  project;
  options;

  /**
   * 
   * @param {projectItem} project 
   * @param {moduleItem} module 
   * @param {Array} options 
   */
  constructor(project, options) {
    this.project = project;
    this.options = options;
  }

  /**
   * 
   */
  async build() {
    
    // Loop all modules
    
  }
}

export default projectBuilder;