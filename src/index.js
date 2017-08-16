#!/usr/bin/env node
import program from 'commander';
import Helpers from './classes/Helpers';
import GDAX from './classes/GDAX';
import CoinMarketCap from './classes/CoinMarketCap';
import Kraken from './classes/Kraken';

program.version('1.0.0');

// GDAX
program
  .command('gdax [currency]')
  .action(currency => {
    const symbol = currency.toUpperCase();
    GDAX.getCurrency(symbol)
    .then(res => {
      console.log(`${GDAX_MAP[symbol]} (${symbol}): $${Helpers.round(res)}`);
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
      console.log(`${res.name} (${res.symbol}): $${Helpers.round(res.price_usd)}`);
    }, err => {
      console.log(err);
    });
  });

  // CoinMarketCap
  program
    .command('kraken [currency]')
    .action(currency => {
      const currencyData = Helpers.mapCurrency(currency);
      let symbol = currency;
      if (currencyData.name.toLowerCase() === 'bitcoin') {
        symbol = currencyData.symbols[1];
      }
      Kraken.getCurrency(symbol)
      .then(res => {
        console.log(`${currencyData.name} (${currency.toUpperCase()}): $${Helpers.round(res)}`);
      }, err => {
        console.log(err);
      });
    });

program.parse(process.argv);
