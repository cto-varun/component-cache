"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _jsonata = _interopRequireDefault(require("jsonata"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function has(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}
class Cache {
  constructor() {
    this.store = {};
  }
  put(key, value, ttl) {
    if (typeof key === 'undefined') throw new Error('Required argument key is undefined');
    const oldRecord = has(this.store, key) ? this.store[key] : undefined;
    if (oldRecord && oldRecord.timeout) {
      window[window.sessionStorage?.tabId].clearTimeout(oldRecord.timeout);
    }
    const newRecord = {
      value
    };
    if (ttl && ttl !== 0) {
      newRecord.timeout = window[window.sessionStorage?.tabId].setTimeout(this.delInternal.bind(this, key), ttl);
    }
    this.store[key] = newRecord;
    return {
      oldValue: oldRecord?.value,
      ...value
    };
  }
  get(key, defaultVal) {
    if (typeof key === 'undefined') throw new Error('Required argument key is undefined');
    var record = this.store[key];
    return record?.value || defaultVal;
  }
  contains(key) {
    if (typeof key === 'undefined') throw new Error('Required argument key is undefined');
    return this.store[key] ? true : false;
  }
  remove(key) {
    if (typeof key === 'undefined') throw new Error('Required argument key is undefined');
    return this.delInternal(key);
  }
  removeAll(keys) {
    return keys.map(k => this.delInternal(k));
  }
  eval(expression) {
    let context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let keys = arguments.length > 2 ? arguments[2] : undefined;
    return (0, _jsonata.default)(expression).evaluate({
      state: this.getAll(keys),
      ...context
    });
  }
  clear() {
    this.store = {};
  }
  getAll(keys) {
    const cache = {};
    if (keys) {
      keys.forEach(k => cache[k] = this.store[k]?.value);
    } else {
      Object.keys(this.store).forEach(k => cache[k] = this.store[k]?.value);
    }
    return cache;
  }
  delInternal(key) {
    if (has(this.store, key)) {
      // Clear timeout
      if (this.store[key].timeout) {
        window[window.sessionStorage?.tabId].clearTimeout(this.store[key].timeout);
      }

      // Delete record
      return delete this.store[key];
    } else {
      return false;
    }
  }
}
const cache = new Cache();
Object.freeze(cache);
var _default = cache;
exports.default = _default;
module.exports = exports.default;