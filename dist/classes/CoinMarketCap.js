'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CoinMarketCap = function () {
  function CoinMarketCap() {
    _classCallCheck(this, CoinMarketCap);
  }

  _createClass(CoinMarketCap, null, [{
    key: 'getCurrency',

    /**
     * Gets price of currency on CoinMarketCap
     * TODO: Refactor so it doesn't fetch all but their API only allows full name for
     * Individual calls. Ex: https://api.coinmarketcap.com/v1/ticker/bitcoin
     *
     * @param {string} currency Currency to fetch
     * @return {Promise}
     */
    value: function getCurrency(currency) {
      return new Promise(function (resolve, reject) {
        (0, _request2.default)('https://api.coinmarketcap.com/v1/ticker/', function (err, resp, body) {
          var output = JSON.parse(body);
          var found = false;
          for (var i = 0; i < output.length; i++) {
            if (output[i].symbol.toUpperCase() === currency.toUpperCase()) {
              resolve(output[i]);
              break;
            }
          }
          reject('Symbol not found on CoinMarketCap');
        });
      });
    }
  }]);

  return CoinMarketCap;
}();

exports.default = CoinMarketCap;