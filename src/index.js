#!/usr/bin/env node
import program from 'commander';
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

program.parse(process.argv);
