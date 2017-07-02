#!/usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _GDAX = require('./classes/GDAX');

var _GDAX2 = _interopRequireDefault(_GDAX);

var _CoinMarketCap = require('./classes/CoinMarketCap');

var _CoinMarketCap2 = _interopRequireDefault(_CoinMarketCap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version('1.0.0');

var GDAX_MAP = {
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  LTC: 'Litecoin'
};

// GDAX
_commander2.default.command('gdax [currency]').action(function (currency) {
  var symbol = currency.toUpperCase();
  _GDAX2.default.getCurrency(symbol).then(function (res) {
    console.log(GDAX_MAP[symbol] + ' (' + symbol + '): $' + res);
  }, function (err) {
    console.log(err);
  });
});

// CoinMarketCap
_commander2.default.command('cmc [currency]').action(function (currency) {
  _CoinMarketCap2.default.getCurrency(currency).then(function (res) {
    console.log(res.name + ' (' + res.symbol + '): $' + Number(res.price_usd).toFixed(2));
  }, function (err) {
    console.log(err);
  });
});

_commander2.default.parse(process.argv);