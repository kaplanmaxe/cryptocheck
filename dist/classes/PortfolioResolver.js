'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();var _GDAX = require('./GDAX');var _GDAX2 = _interopRequireDefault(_GDAX);
var _CoinMarketCap = require('./CoinMarketCap');var _CoinMarketCap2 = _interopRequireDefault(_CoinMarketCap);
var _Kraken = require('./Kraken');var _Kraken2 = _interopRequireDefault(_Kraken);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var

NotRecognizedMarket = function () {
  /**
                                    * Null Object pattern for unrecognized market.
                                    *
                                    * @param {string} market The market that wasn't recognized
                                    */
  function NotRecognizedMarket(market) {_classCallCheck(this, NotRecognizedMarket);
    this.market = market;
  }

  /* eslint-disable no-unused-vars */

  /**
                                       * Returns a failed promise explaining the problem.
                                       *
                                       * @param {string} Currency Currency to fetch
                                       * @return {Promise}
                                       */_createClass(NotRecognizedMarket, [{ key: 'getCurrency', value: function getCurrency(
    currency) {
      return Promise.reject('Market ' + this.market + ' not supported.');
    }
    /* eslint-enable */ }]);return NotRecognizedMarket;}();var


PortfolioResolver = function () {
  /**
                                  * Deals with fetching the required information for the portfolio command.
                                  *
                                  * @param {string} market The market that wasn't recognized
                                  */
  function PortfolioResolver(_ref) {var _ref$market = _ref.market,market = _ref$market === undefined ? 'cmc' : _ref$market;_classCallCheck(this, PortfolioResolver);
    this.market = market;
  }

  /**
     * Looks up the passed in assets and calculates that positions'
     * worth.
     *
     * @param {object} Positions Maps ticker symbol to position.
     * @return {Promise}
     */_createClass(PortfolioResolver, [{ key: 'getAssetValuesForPositions', value: function getAssetValuesForPositions(
    positions) {var _this = this;
      var notSupportedTickers = [];
      var allAssetValueResolvers = Object.keys(positions).map(function (symbol) {
        return _this.getAssetValueForTickerAndPosition(symbol.toUpperCase(), positions[symbol]).
        then(function (successValue) {return Promise.resolve(successValue);}, // eslint-disable-line arrow-body-style
        function (errorMessage) {
          if (errorMessage === 'Asset not found.') {
            notSupportedTickers.push(symbol);
            return Promise.resolve();
          }
          return Promise.reject(errorMessage);
        });
      });
      return Promise.all(allAssetValueResolvers).then(function (assetValues) {
        return {
          assets: assetValues.filter(function (n) {return n;}), // eslint-disable-line arrow-body-style
          notSupported: notSupportedTickers };

      });
    }

    /**
       * Looks up the passed in ticker symbol and calculates that position's
       * worth.
       *
       * @param {string} Ticker The symbol to look up
       * @param {position} Position The portfolio position
       * @return {Promise}
       */ }, { key: 'getAssetValueForTickerAndPosition', value: function getAssetValueForTickerAndPosition(
    ticker, position) {
      return this.getCurrencyDataForTicker(ticker).then(function (priceData) {
        priceData.value = priceData.price * position;
        return priceData;
      });
    }

    /**
       * Uses the proper currency market to look up the ticker.
       *
       * @param {string} Ticker The symbol to look up
       * @return {Promise}
       */ }, { key: 'getCurrencyDataForTicker', value: function getCurrencyDataForTicker(
    ticker) {
      return this.currencyResolver.getCurrency(ticker).then(function (priceData) {
        return {
          symbol: priceData.symbol,
          price: priceData.price_usd,
          value: -1,
          change: priceData && priceData.percent_change_24h };

      });
    }

    /**
       * Returns the market api that is requested.
       *
       * @return {object}
       */ }, { key: 'currencyResolver', get: function get()
    {
      if (this.market === 'gdax') {
        return _GDAX2.default;
      } else if (this.market === 'kraken') {
        return _Kraken2.default;
      } else if (this.market === 'cmc') {
        return _CoinMarketCap2.default;
      }
      return new NotRecognizedMarket(this.market);
    } }]);return PortfolioResolver;}();exports.default = PortfolioResolver;