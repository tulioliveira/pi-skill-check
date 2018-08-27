import AsyncLock from 'async-lock';
import _ from 'lodash';
import moment from 'moment';
import db from './database';

const lock = new AsyncLock();

// Logger Object
const logger = {
  /**
   * Log info data in the console
   * @param {string} info - The information message
   */
  info: (info) => {
    console.log(`[${moment().format('HH:mm:ss DD/MM/YYYY')}] Info: ${info}`);
  },
  /**
   * Log error data in the console
   * @param {string} info - The error
   */
  error: (error) => {
    console.log(`[${moment().format('HH:mm:ss DD/MM/YYYY')}] Error: ${error}`);
  }
};

/**
 * Calculate a term from the Gregory-Leibniz series for pi approximation
 * @param {number} termIndex - The order of the term to be calculated
 * @return {number} - The term value
 */
const calculateTerm = termIndex => (4 * ((-1) ** termIndex)) / ((2 * termIndex) + 1);

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
  lock.acquire('pi', (done) => {
    db.pi.findOne({}, (err, data) => {
      if (err) {
        logger.error(err);
        done();
      }
      if (data) {
        if (_.includes(data.termsIndexes, termIndex)) {
          logger.info(`Pi already contains term ${termIndex}.`);
          done();
        }
        else {
          db.pi.update({}, {
            pi: data.pi + termValue,
            termsIndexes: [...data.termsIndexes, termIndex]
          }, {}, (updateError) => {
            if (updateError) {
              logger.error(updateError);
            }
            else {
              logger.info(`Successfully added term ${termIndex}`);
            }
            done();
          });
        }
      }
      else {
        db.pi.insert({ pi: termValue, termsIndexes: [termIndex] }, (insertError) => {
          if (insertError) {
            logger.error(insertError);
          }
          else {
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
const getTerms = () => (
  new Promise((resolve, reject) => {
    db.terms.find({}).sort({ index: 1 }).exec((err, terms) => {
      if (err) {
        logger.error(err);
        reject(err);
      }

      const result = terms.map(({ index, value }) => ({ index, value }));
      resolve(result);
    });
  })
);

/**
 * Get a term by it's index, fetching it from the database or calculating it if
 * it has not been calculated
 * @param {number} index - The order of the term to be returned
 * @return {Promise} - Promise object of the term
 */
const getTermByIndex = index => (
  new Promise((resolve, reject) => {
    /**
     * Because this logic can't be fully executed in a single event loop, it's a
     * critical section where concurrent access will happen to the same term resource
     */
    lock.acquire(`term${index}`, (done) => {
      db.terms.findOne({ index }, (fetchError, term) => {
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
          db.terms.insert({ index, value }, (insertError) => {
            if (insertError) {
              logger.error(insertError);
              done();
              reject(insertError);
            }
            else {
              logger.info(`Term ${index} (${value}) saved to database.`);
              addToPi(index, value);
              done();
              resolve({ index, value });
            }
          });
        }
      });
    });
  })
);

/**
 * Get the current approximation of Pi
 * @return {Promise} - Promise object of Pi
 */
const getPi = () => (
  new Promise((resolve, reject) => {
    db.pi.findOne({}, (err, data) => {
      if (err) {
        logger.error(err);
        reject(err);
      }
      if (data) {
        resolve({ pi: data.pi, termsIndexes: _.sortBy(data.termsIndexes) });
      }
      else {
        resolve({ pi: 0, termsIndexes: [] });
      }
    });
  })
);

export { getTerms, getTermByIndex, getPi };
