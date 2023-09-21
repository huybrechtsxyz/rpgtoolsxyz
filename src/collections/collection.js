'use-strict';

import path from 'path';
import Datastore from 'nedb-promises';
import { error } from 'console';

class collection {
  name;
  ready;
  datapath;
  datastore;

  constructor(baseDir, collection) {
    this.name = collection;
    this.ready = false;
    this.datapath = path.join(baseDir, collection);
  }

  async load(indexes = null) {
    this.ready = false;
    this.datastore = Datastore.create(this.datapath);
    this.datastore.load(); 
    if (indexes) 
      for (let i=0; i<indexes.length; i++)
        { this.datastore.ensureIndex(indexes[i]); }
    this.ready = true;
  }

  async create(query, item) {
    let found = false;
    if (!this.ready)
      throw error(`Collection ${this.name} is not initialized`);
    await this.datastore.findOne(query).then(
      (doc) => { if (doc) { found = true; item = doc; } }
    );
    if (!found) {
      return await this.datastore.insert(item);
    } else {
      return null;
    }
  }

  async update(query, fields) {
    let item = null;
    if (!this.ready)
      throw error(`Collection ${this.name} is not initialized`);
    await this.datastore.findOne(query)
      .then( (doc) => { if (doc) { this.datastore.update({ _id: doc._id }, fields); item = doc; } })
      .catch( (err) => { throw err; });
    return item;
  }

  async remove(query, item) {
    let found = false;
    if (!this.ready)
      throw error(`Collection ${this.name} is not initialized`);
    await this.datastore.findOne(query)
      .then( (doc) => { if (doc) { this.datastore.remove({ _id: doc._id }); found = true; } })
      .catch( (err) => { throw err; });
    return found;
  }

  async find(query) {
    let items = {};
    if (!this.ready)
      throw error(`Collection ${this.name} is not initialized`);
    await this.datastore.find(query).then(
      (docs) => { if (docs) items = docs; }
    );
    return items;
  }

  async findOne(query) {
    let item = null;
    if (!this.ready)
      throw error(`Collection ${this.name} is not initialized`);
    await this.datastore.findOne(query).then(
      (doc) => { if (doc) item = doc; }
    );
    return item;
  }
}

export default collection;