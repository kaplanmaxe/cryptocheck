'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();var _request = require('request');var _request2 = _interopRequireDefault(_request);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}

var headers = {
  'User-Agent': 'request' };var


GDAX = function () {function GDAX() {_classCallCheck(this, GDAX);}_createClass(GDAX, null, [{ key: 'getCurrency',
    /**
                                                                                                                   * Calls GDAX API to get price
                                                                                                                   *
                                                                                                                   * @param {string} Currency Currency to fetch
                                                                                                                   * @return {Promise}
                                                                                                                   */value: function getCurrency(
    currency) {
      return new Promise(function (resolve, reject) {
        (0, _request2.default)({ url: 'https://api.gdax.com/products/' + currency + '-USD/ticker', headers: headers }, function (err, response, body) {
          if (response.statusCode === 404) reject('Asset not found.');
          var output = JSON.parse(body);
          resolve(output.price);
        });
      });
    } }]);return GDAX;}();exports.default = GDAX;