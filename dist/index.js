#!/usr/bin/env node
'use strict';
var _fs = require('fs');var _fs2 = _interopRequireDefault(_fs);
var _commander = require('commander');var _commander2 = _interopRequireDefault(_commander);
require('console.table');
var _Helpers = require('./classes/Helpers');var _Helpers2 = _interopRequireDefault(_Helpers);
var _GDAX = require('./classes/GDAX');var _GDAX2 = _interopRequireDefault(_GDAX);
var _CoinMarketCap = require('./classes/CoinMarketCap');var _CoinMarketCap2 = _interopRequireDefault(_CoinMarketCap);
var _Kraken = require('./classes/Kraken');var _Kraken2 = _interopRequireDefault(_Kraken);
var _PortfolioResolver = require('./classes/PortfolioResolver');var _PortfolioResolver2 = _interopRequireDefault(_PortfolioResolver);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

_commander2.default.version('1.0.0');

/**
                                       * Gets associated data for currency given symbol
                                       *
                                       * @param  {string} currency Symbol of currency
                                       * @param  {string} source gdax|kraken
                                       * @return {object}
                                       */
function getCurrencyData(currency, source) {
  var currencyData = _Helpers2.default.mapCurrency(currency);
  var index = source === 'gdax' ? 0 : currencyData.symbols.length - 1;
  var symbol = currency;
  if (currencyData && currencyData.symbols.length > 1) {
    symbol = currencyData.symbols[index];
  }
  return Object.assign({}, currencyData, { symbol: symbol });
}

// GDAX
_commander2.default.
command('gdax [currency]').
action(function (currency) {
  var currencyData = getCurrencyData(currency, 'gdax');
  _GDAX2.default.getCurrency(currencyData.symbol).
  then(function (res) {
    console.log(currencyData.name + ' (' + currency.toUpperCase() + '): $' + _Helpers2.default.round(res.price_usd));
  }, function (err) {
    console.log(err);
  });
});

// CoinMarketCap
_commander2.default.
command('cmc [currency]').
action(function (currency) {
  _CoinMarketCap2.default.getCurrency(currency).
  then(function (res) {
    console.log(res.name + ' (' + res.symbol + '): $' + _Helpers2.default.round(res.price_usd) + ' (' + res.percent_change_24h + '%)');
  }, function (err) {
    console.log(err);
  });
});

// Kraken
_commander2.default.
command('kraken [currency]').
action(function (currency) {
  var currencyData = getCurrencyData(currency, 'kraken');
  _Kraken2.default.getCurrency(currencyData.symbol).
  then(function (res) {
    console.log(currencyData.name + ' (' + currency.toUpperCase() + '): $' + _Helpers2.default.round(res.price_usd));
  }, function (err) {
    console.log(err);
  });
});


_commander2.default.
command('portfolio [fileLocation]').
option('-m, --market [market]').
action(function (fileLocation, options) {
  var fullPath = process.cwd() + '/' + fileLocation;
  var market = options.market || 'cmc';
  var portfolioResolver = new _PortfolioResolver2.default({ market: market });
  _fs2.default.readFile(fullPath, 'utf8', function (err, data) {
    if (err) throw err;
    var obj = JSON.parse(data);
    portfolioResolver.getAssetValuesForPositions(obj).then(function (portfolio) {
      var total = 0;
      var formattedAssets = portfolio.assets.map(function (asset) {
        total += asset.value;
        asset.price = '$' + _Helpers2.default.round(asset.price);
        asset.value = '$' + _Helpers2.default.round(asset.value);
        asset.change = asset.change ? asset.change + '%' : "Unknown";
        return asset;
      });

      console.table(formattedAssets);

      if (portfolio.notSupported.length > 0) {
        var formatedNotSupportedTickers = portfolio.notSupported.join(", ");
        console.log('Market doesn\'t support: ' + formatedNotSupportedTickers);
      }
      console.log('Total: $' + _Helpers2.default.round(total));
    }).catch(function (message) {
      console.log('Errored: ' + message);
    });
  });
});
_commander2.default.parse(process.argv);