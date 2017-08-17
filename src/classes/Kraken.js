import request from 'request';

export default class Kraken {
  /**
   * Gets currency pair price
   *
   * @param {string} asset Asset to check price of
   */
  static getCurrency(asset, currency = 'USD') {
    return new Promise((resolve, reject) => {
      request(`https://api.kraken.com/0/public/Ticker?pair=${asset}${currency}`, (err, response, body) => {
        const output = JSON.parse(body);
        if (output.error.length > 0) return reject('Asset not found');
        // Kraken's output is a little weird. Always take the first object key.
        resolve(output.result[Object.keys(output.result)[0]].c[0]);
      });
    });
  }
}
