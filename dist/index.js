#!/usr/bin/env node
'use strict';
var _commander = require('commander');var _commander2 = _interopRequireDefault(_commander);
var _Helpers = require('./classes/Helpers');var _Helpers2 = _interopRequireDefault(_Helpers);
var _GDAX = require('./classes/GDAX');var _GDAX2 = _interopRequireDefault(_GDAX);
var _CoinMarketCap = require('./classes/CoinMarketCap');var _CoinMarketCap2 = _interopRequireDefault(_CoinMarketCap);
var _Kraken = require('./classes/Kraken');var _Kraken2 = _interopRequireDefault(_Kraken);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

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
    console.log(currencyData.name + ' (' + currency.toUpperCase() + '): $' + _Helpers2.default.round(res));
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
    console.log(currencyData.name + ' (' + currency.toUpperCase() + '): $' + _Helpers2.default.round(res));
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
  var fs = require('fs');
  fs.readFile(fullPath, 'utf8', function (err, data) {
    if (err) throw err;
    var obj = JSON.parse(data);
    var keys = Object.keys(obj);
    var proms = [];
    var portfolioData = {};
    keys.forEach(function (key) {
      portfolioData[key.toUpperCase()] = obj[key];
      proms.push(getCurrecyData(market.toLowerCase(), key));
    }, this);
    Promise.all(proms).
    then(function (res) {
      showPortfolio(res, portfolioData);
    }, function (err) {
      console.log('Errored ' + err);
    });
  });
});

function getCurrecyData(market, currency) {
  if (market == 'gdax')
  return _GDAX2.default.getCurrency(currency);else
  if (market == 'kraken')
  return _Kraken2.default.getCurrency(currency);else
  if (market == 'cmc')
  return _CoinMarketCap2.default.getCurrency(currency);else

  return null;
}

function showPortfolio(res, obj) {
  console.log('--------------------------------------------------------------------------------------------');
  console.log('Symbol   Price     Acct. Val     %Change');
  console.log('--------------------------------------------------------------------------------------------');
  var total = 0;
  res.forEach(function (currency) {

    var currentVal = _Helpers2.default.round(obj[currency.symbol] * currency.price_usd);
    total += Number(currentVal);
    console.log(currency.symbol + '    $' + _Helpers2.default.round(currency.price_usd) + '    $' + currentVal + '      $' + currency.percent_change_24h + '%');
  }, this);
  console.log('--------------------------------------------------------------------------------------------');
  console.log('Total : $' + _Helpers2.default.round(total));
};

_commander2.default.parse(process.argv);