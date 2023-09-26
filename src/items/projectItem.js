'use strict';

class projectItem {
  constructor(name = '', path = '') {
    this.name = name;
    this.path = path;
  }

  name;
  path;
}

export default projectItem;