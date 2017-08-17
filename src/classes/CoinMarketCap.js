import request from 'request';

export default class CoinMarketCap {
  /**
   * Gets price of currency on CoinMarketCap
   * TODO: Refactor so it doesn't fetch all but their API only allows full name for
   * Individual calls. Ex: https://api.coinmarketcap.com/v1/ticker/bitcoin
   *
   * @param {string} currency Currency to fetch
   * @return {Promise}
   */
  static getCurrency(currency) {
    return new Promise((resolve, reject) => {
      request('https://api.coinmarketcap.com/v1/ticker/', (err, resp, body) => {
        const output = JSON.parse(body);
        for (let i = 0; i < output.length; i++) {
          if (output[i].symbol.toUpperCase() === currency.toUpperCase()) {
            resolve(output[i]);
            break;
          }
        }
        reject('Asset not found.');
      });
    });
  }
}
