#!/usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _Helpers = require('./classes/Helpers');

var _Helpers2 = _interopRequireDefault(_Helpers);

var _GDAX = require('./classes/GDAX');

var _GDAX2 = _interopRequireDefault(_GDAX);

var _CoinMarketCap = require('./classes/CoinMarketCap');

var _CoinMarketCap2 = _interopRequireDefault(_CoinMarketCap);

var _Kraken = require('./classes/Kraken');

var _Kraken2 = _interopRequireDefault(_Kraken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version('1.0.0');

// GDAX
_commander2.default.command('gdax [currency]').action(function (currency) {
  var currencyData = _Helpers2.default.mapCurrency(currency);
  var symbol = currency;
  if (currencyData && currencyData.symbols.length > 1) {
    // Kraken symbol always used at end
    symbol = currencyData.symbols[currencyData.symbols.length - 1];
  }
  _GDAX2.default.getCurrency(symbol).then(function (res) {
    console.log(currencyData.name + ' (' + symbol.toUpperCase() + '): $' + _Helpers2.default.round(res));
  }, function (err) {
    console.log(err);
  });
});

// CoinMarketCap
_commander2.default.command('cmc [currency]').action(function (currency) {
  _CoinMarketCap2.default.getCurrency(currency).then(function (res) {
    console.log(res.name + ' (' + res.symbol + '): $' + _Helpers2.default.round(res.price_usd));
  }, function (err) {
    console.log(err);
  });
});

// CoinMarketCap
_commander2.default.command('kraken [currency]').action(function (currency) {
  var currencyData = _Helpers2.default.mapCurrency(currency);
  var symbol = currency;
  if (currencyData && currencyData.symbols.length > 1) {
    // Kraken symbol always used at end
    symbol = currencyData.symbols[currencyData.symbols.length - 1];
  }
  _Kraken2.default.getCurrency(symbol).then(function (res) {
    console.log(currencyData.name + ' (' + currency.toUpperCase() + '): $' + _Helpers2.default.round(res));
  }, function (err) {
    console.log(err);
  });
});

_commander2.default.parse(process.argv);