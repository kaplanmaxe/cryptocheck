#!/usr/bin/env node
import fs from 'fs';
import program from 'commander';
import 'console.table';
import Helpers from './classes/Helpers';
import GDAX from './classes/GDAX';
import CoinMarketCap from './classes/CoinMarketCap';
import Kraken from './classes/Kraken';

program.version('1.0.0');

/**
 * Gets associated data for currency given symbol
 *
 * @param  {string} currency Symbol of currency
 * @param  {string} source gdax|kraken
 * @return {object}
 */
function getCurrencyData(currency, source) {
  const currencyData = Helpers.mapCurrency(currency);
  const index = source === 'gdax' ? 0 : currencyData.symbols.length - 1;
  let symbol = currency;
  if (currencyData && currencyData.symbols.length > 1) {
    symbol = currencyData.symbols[index];
  }
  return Object.assign({}, currencyData, { symbol });
}

// GDAX
program
  .command('gdax [currency]')
  .action(currency => {
    const currencyData = getCurrencyData(currency, 'gdax');
    GDAX.getCurrency(currencyData.symbol)
    .then(res => {
      console.log(`${currencyData.name} (${currency.toUpperCase()}): $${Helpers.round(res)}`);
    }, err => {
      console.log(err);
    });
  });

// CoinMarketCap
program
  .command('cmc [currency]')
  .action(currency => {
    CoinMarketCap.getCurrency(currency)
    .then(res => {
      console.log(`${res.name} (${res.symbol}): $${Helpers.round(res.price_usd)} (${res.percent_change_24h}%)`);
    }, err => {
      console.log(err);
    });
  });

  // Kraken
  program
    .command('kraken [currency]')
    .action(currency => {
      const currencyData = getCurrencyData(currency, 'kraken');
      Kraken.getCurrency(currencyData.symbol)
      .then(res => {
        console.log(`${currencyData.name} (${currency.toUpperCase()}): $${Helpers.round(res)}`);
      }, err => {
        console.log(err);
      });
    });


program
  .command('portfolio [fileLocation]')
  .option('-m, --market [market]')
  .action((fileLocation, options) => {
      const fullPath = `${process.cwd()}/${fileLocation}`;
      const market = options.market || 'cmc';
      fs.readFile(fullPath, 'utf8', function(err, data) {
          if (err) throw err;
          const obj = JSON.parse(data);
          const keys = Object.keys(obj);
          const proms = [];
          const portfolioData = {};
          keys.forEach(key => {
              portfolioData[key.toUpperCase()] = obj[key];
              proms.push(getPortfolioData(market.toLowerCase(), key));
          }, this);
          Promise.all(proms)
          .then(res => {
             showPortfolio(res, portfolioData);
          }, error => {
             console.log(`Errored ${error}`);
          });
      });
  });

  /**
   * Returns appropriate promise as per market.
   * @param {string} market
   * @param {string} currency
   */
  function getPortfolioData(market, currency) {
      if (market === 'gdax') {
        return GDAX.getCurrency(currency);
      } else if (market === 'kraken') {
        return Kraken.getCurrency(currency);
      } else if (market === 'cmc') {
        return CoinMarketCap.getCurrency(currency);
      }

      return Promise.reject("Market ${market} not supported");
  }

  /**
   * Prints portfolio
   * @param {Array} res : array of dictionaries.
   * @param {Dictionary} obj : portfolio dictinary.
   */
 function showPortfolio(currencies, obj) {
  const data = currencies.map(res => {
    return {
      symbol: res.symbol,
      price: `$${Helpers.round(res.price_usd)}`,
      value: `$${Helpers.round(obj[res.symbol] * res.price_usd)}`,
      change: `${res.percent_change_24h}%`,
    };
  });
  const total = data
    .map(res => { return Number(res.value.split('$')[1]); })
    .reduce((sum, value) => { return Number(sum) + value; }, 0);
  console.table(data);
  console.log(`Total: $${Helpers.round(total)}`);
 }
program.parse(process.argv);
