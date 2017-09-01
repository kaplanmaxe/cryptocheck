#!/usr/bin/env node
import fs from 'fs';
import program from 'commander';
import 'console.table';
import Helpers from './classes/Helpers';
import GDAX from './classes/GDAX';
import CoinMarketCap from './classes/CoinMarketCap';
import Kraken from './classes/Kraken';
import PortfolioResolver from './classes/PortfolioResolver';

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
      console.log(`${currencyData.name} (${currency.toUpperCase()}): $${Helpers.round(res.price_usd)}`);
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
        console.log(`${currencyData.name} (${currency.toUpperCase()}): $${Helpers.round(res.price_usd)}`);
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
      const portfolioResolver = new PortfolioResolver({ market });
      fs.readFile(fullPath, 'utf8', (err, data) => {
          if (err) throw err;
          const obj = JSON.parse(data);
          portfolioResolver.getAssetValuesForPositions(obj).then(portfolio => {
            let total = 0;
            const formattedAssets = portfolio.assets.map(asset => {
              total += asset.value;
              asset.price = `$${Helpers.round(asset.price)}`;
              asset.value = `$${Helpers.round(asset.value)}`;
              asset.change = asset.change ? `${asset.change}%` : 'Unknown';
              return asset;
            });

            console.table(formattedAssets);

            if (portfolio.notSupported.length > 0) {
              const formatedNotSupportedTickers = portfolio.notSupported.join(', ');
              console.log(`Market doesn't support: ${formatedNotSupportedTickers}`);
            }
            console.log(`Total: $${Helpers.round(total)}`);
          }).catch(message => {
            console.log(`Errored: ${message}`);
          });
      });
  });
program.parse(process.argv);
