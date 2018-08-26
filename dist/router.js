'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _provider = require('./provider');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

/**
 * @api {get} /terms Request for all calculated terms
 * @apiName GetAllTerms
 * @apiGroup Term
 *
 * @apiSuccess {Array} terms Array containing all calculated terms
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "index": 0,
 *         "value": 4
 *       },
 *       {
 *         "index": 1,
 *         "value": -1.3333333333333333
 *       },
 *       {
 *         "index": 10,
 *         "value": 0.19047619047619047
 *       },
 *       {
 *         "index": 25,
 *         "value": -0.0784313725490196
 *       },
 *       {
 *         "index": 50,
 *         "value": 0.039603960396039604
 *       }
 *     ]
 */
router.get('/terms', async (req, res) => {
  try {
    const data = await (0, _provider.getTerms)();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching terms' });
  }
});

/**
 * @api {get} /terms/:index Request Term Value
 * @apiName GetTerm
 * @apiGroup Term
 *
 * @apiParam {Number} index The term index
 *
 * @apiSuccess {Number} index Term index.
 * @apiSuccess {Number} value Term value.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "index": 1,
 *       "value": -1.3333333333333333
 *     }
 *
 * @apiError WrongIndexType The index passed is not an integer.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Term index is not an integer."
 *     }
 */
router.get('/terms/:index', async (req, res) => {
  const termIndex = parseInt(req.params.index, 10);
  if (termIndex >= 0) {
    try {
      const data = await (0, _provider.getTermByIndex)(termIndex);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: `Error fetching term ${termIndex}` });
    }
  } else {
    res.status(400).json({ error: 'Term index is not an integer.' });
  }
});

/**
 * @api {get} /pi Request accumulated Pi value
 * @apiName GetPi
 * @apiGroup Pi
 *
 * @apiSuccess {Number} pi Current Pi approximation.
 * @apiSuccess {array} termsIndexes Terms used in the current approximation.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "pi": 2.8183154449898775,
 *       "termsIndexes": [
 *         0,
 *         1,
 *         10,
 *         25,
 *         50
 *       ]
 *     }
 */
router.get('/pi', async (req, res) => {
  try {
    const data = await (0, _provider.getPi)();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Couldn`t fetch data from database' });
  }
});

exports.default = router;