'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPi = exports.getTermByIndex = exports.getTerms = undefined;

var _asyncLock = require('async-lock');

var _asyncLock2 = _interopRequireDefault(_asyncLock);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _database = require('./database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const lock = new _asyncLock2.default();

// Logger Object
const logger = {
  /**
   * Log info data in the console
   * @param {string} info - The information message
   */
  info: info => {
    console.log(`[${(0, _moment2.default)().format('HH:mm:ss DD/MM/YYYY')}] Info: ${info}`);
  },
  /**
   * Log error data in the console
   * @param {string} info - The error
   */
  error: error => {
    console.log(`[${(0, _moment2.default)().format('HH:mm:ss DD/MM/YYYY')}] Error: ${error}`);
  }
};

/**
 * Calculate a term from the Gregory-Leibniz series for pi approximation
 * @param {number} termIndex - The order of the term to be calculated
 * @return {number} - The term value
 */
const calculateTerm = termIndex => 4 * Math.pow(-1, termIndex) / (2 * termIndex + 1);

/**
 * Add the term to the calculated pi approximation
 * @param {number} termIndex - The order of the term to be added
 * @param {number} termValue - The term termValue
 */
const addToPi = (termIndex, termValue) => {
  /**
   * Because this logic can't be fully executed in a single event loop, it's a
   * critical section where concurrent access may happen adding to Pi
   */
  lock.acquire('pi', done => {
    _database2.default.pi.findOne({}, (err, data) => {
      if (err) {
        logger.error(err);
        done();
      }
      if (data) {
        if (_lodash2.default.includes(data.termsIndexes, termIndex)) {
          logger.info(`Pi already contains term ${termIndex}.`);
          done();
        } else {
          _database2.default.pi.update({}, {
            pi: data.pi + termValue,
            termsIndexes: [...data.termsIndexes, termIndex]
          }, {}, updateError => {
            if (updateError) {
              logger.error(updateError);
            } else {
              logger.info(`Successfully added term ${termIndex}`);
            }
            done();
          });
        }
      } else {
        _database2.default.pi.insert({ pi: termValue, termsIndexes: [termIndex] }, insertError => {
          if (insertError) {
            logger.error(insertError);
          } else {
            logger.info(`Successfully added term ${termIndex}. Pi object was created in the database.`);
          }
          done();
        });
      }
    });
  });
};

/**
 * Get all the terms already calculated
 * @return {Promise} - Promise object of the terms in database
 */
const getTerms = () => new Promise((resolve, reject) => {
  _database2.default.terms.find({}).sort({ index: 1 }).exec((err, terms) => {
    if (err) {
      logger.error(err);
      reject(err);
    }

    const result = terms.map(({ index, value }) => ({ index, value }));
    resolve(result);
  });
});

/**
 * Get a term by it's index, fetching it from the database or calculating it if
 * it has not been calculated
 * @param {number} index - The order of the term to be returned
 * @return {Promise} - Promise object of the term
 */
const getTermByIndex = index => new Promise((resolve, reject) => {
  /**
   * Because this logic can't be fully executed in a single event loop, it's a
   * critical section where concurrent access will happen to the same term resource
   */
  lock.acquire(`term${index}`, done => {
    _database2.default.terms.findOne({ index }, (fetchError, term) => {
      if (fetchError) {
        logger.error(fetchError);
        done();
        reject(fetchError);
      }
      // Term already calculated and found in database
      else if (term) {
          logger.info(`Term ${term.index} (${term.value}) retrieved from database.`);
          done();
          resolve({ index: term.index, value: term.value });
        }

        // Calculate term and save to database
        else {
            const value = calculateTerm(index);
            _database2.default.terms.insert({ index, value }, insertError => {
              if (insertError) {
                logger.error(insertError);
                done();
                reject(insertError);
              } else {
                logger.info(`Term ${index} (${value}) saved to database.`);
                addToPi(index, value);
                done();
                resolve({ index, value });
              }
            });
          }
    });
  });
});

/**
 * Get the current approximation of Pi
 * @return {Promise} - Promise object of Pi
 */
const getPi = () => new Promise((resolve, reject) => {
  _database2.default.pi.findOne({}, (err, data) => {
    if (err) {
      logger.error(err);
      reject(err);
    }
    if (data) {
      resolve({ pi: data.pi, termsIndexes: _lodash2.default.sortBy(data.termsIndexes) });
    } else {
      resolve({ pi: 0, termsIndexes: [] });
    }
  });
});

exports.getTerms = getTerms;
exports.getTermByIndex = getTermByIndex;
exports.getPi = getPi;