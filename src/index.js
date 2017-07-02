#!/usr/bin/env node
import program from 'commander';
import GDAX from './classes/GDAX';
import CoinMarketCap from './classes/CoinMarketCap';

program.version('1.0.0');

const GDAX_MAP = {
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  LTC: 'Litecoin',
};

// GDAX
program
  .command('gdax [currency]')
  .action(currency => {
    const symbol = currency.toUpperCase();
    GDAX.getCurrency(symbol)
    .then(res => {
      console.log(`${GDAX_MAP[symbol]} (${symbol}): $${res}`);
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
      console.log(`${res.name} (${res.symbol}): $${Number(res.price_usd).toFixed(2)}`);
    }, err => {
      console.log(err);
    });
  });

program.parse(process.argv);
