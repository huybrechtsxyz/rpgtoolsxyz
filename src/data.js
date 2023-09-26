'use-strict';

import path from 'path';
import { Level } from 'level';
import { error } from 'console';

class Data {
  db
  name;
  location;
  
  constructor(baseDir, dbname) {
    this.name = dbname;
    this.location = path.join(baseDir, dbname);
    this.db = new Level(this.location, { valueEncoding: 'json' });
  }

  async open() {
    try {
      await this.db.open();
      return this.isOpen();
    }
    catch(error) {
      throw error;
    }
  }

  async close() {
    try {
      await this.db.close();
      return !this.isOpen();
    }
    catch(error) {
      throw error;
    }
  }

  isOpen() {
    if(this.db)
      return (this.db.status == 'open');
    else
     return false;
  }

  async findOne(key) {
    if (!this.isOpen)
      throw error(`Collection ${this.name} is not initialized`);
    try {
      return await this.db.get(key);
    } catch (error) {
      if (error && error.code === 'LEVEL_NOT_FOUND')
        return null;
      else
        throw error;
    }
  }

  async findMany(filter) {
    let values = await this.db.values(filter).all(); //filter = {} > All without limit
    return values;
  }

  async create(key, value) {
    if (!this.isOpen)
      throw error(`Collection ${this.name} is not initialized`);
    let item = await this.findOne(key);
    if (item)
      return null;
    await this.db.put(key, value);
    return value;
  }

  async update(key, value) {
    if (!this.isOpen)
      throw error(`Collection ${this.name} is not initialized`);
    let item = await this.findOne(key);
    if (item) {
      await this.db.put(key, value);
      return value;
    }
    return null;
  }

  async remove(key) {
    if (!this.isOpen)
      throw error(`Collection ${this.name} is not initialized`);
    let item = await this.findOne(key);
    if (item) {
      await this.db.del(key);
      return true;
    }
    return false;
  }
}

export default Data;