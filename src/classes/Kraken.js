import request from 'request';

export default class Kraken {
  /**
   * Gets currency pair price
   *
   * @param {string} asset Asset to check price of
   */
  static getCurrency(rawAsset, currency = 'USD') {
    if (rawAsset == "BTC") {
      var asset = "XBT";
    } else {
      var asset = rawAsset;
    }
    return new Promise((resolve, reject) => {
      request(`https://api.kraken.com/0/public/Ticker?pair=${asset}${currency}`, (err, response, body) => {
        const output = JSON.parse(body);
        if (output.error.length > 0) return reject('Asset not found.');
        // Kraken's output is a little weird. Always take the first object key.
        resolve({symbol: rawAsset, price_usd: output.result[Object.keys(output.result)[0]].c[0]});
      });
    });
  }
}
