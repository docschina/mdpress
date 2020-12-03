import Emitter from 'events';

export default class Store {
  constructor () {
    this.store = {};
    this.emitter = new Emitter();
  }

  $get (key) {
    return this.store[key];
  }

  $set (key, value) {
    this.store[key] = value;
  }

  $emit (...args) {
    this.emitter.emit(...args);
  }

  $on (...args) {
    this.emitter.on(...args);
  }
}
