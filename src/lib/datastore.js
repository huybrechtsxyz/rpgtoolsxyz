'use-strict';

import { Level } from 'level';
import { error } from 'console';

class Datastore {
  db
  name;
  
  constructor(baseDir, dbname, valueEncoding = { valueEncoding: 'json' }) {
    this.name = dbname;
    this.db = new Level(baseDir + '/' + dbname, valueEncoding);
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
      return true;
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
    if (!this.isOpen())
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

  async findAll() {
    return await this.db.values({}).all(); //filter = {} > All without limit
  }

  async create(key, value) {
    if (!this.isOpen())
      throw error(`Collection ${this.name} is not initialized`);
    let item = await this.findOne(key);
    if (item)
      return null;
    await this.db.put(key, value);
    return value;
  }

  async modify(key, value) {
    if (!this.isOpen())
      throw error(`Collection ${this.name} is not initialized`);
    let item = await this.findOne(key);
    if (item) {
      await this.db.put(key, value);
      return value;
    }
    return null;
  }

  async update(key, value) {
    if (!this.isOpen())
      throw error(`Collection ${this.name} is not initialized`);
    await this.db.put(key, value);
    return value;
  }

  async remove(key) {
    if (!this.isOpen())
      throw error(`Collection ${this.name} is not initialized`);
    let item = await this.findOne(key);
    if (item) {
      await this.db.del(key);
      return true;
    }
    return false;
  }
}

export default Datastore;