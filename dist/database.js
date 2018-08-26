'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nedb = require('nedb');

var _nedb2 = _interopRequireDefault(_nedb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create two data stores using NeDB:
 * 1) 'terms.db' to store the terms already calculated
 * 2) 'pi.db' to store the accumulated value of pi
 */
const db = {};
db.terms = new _nedb2.default('data/terms.db');
db.pi = new _nedb2.default('data/pi.db');

db.terms.loadDatabase();
db.pi.loadDatabase();

exports.default = db;