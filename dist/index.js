'use strict';

require('dotenv/config');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create Express App
 */
const app = (0, _express2.default)();
const port = process.env.PORT || 5000;
app.use(_router2.default);
app.listen(port, () => {
  console.log('TrackSale Backend Test: Pi Skill Check');
  console.log(`Server listening on port ${port}!`);
});