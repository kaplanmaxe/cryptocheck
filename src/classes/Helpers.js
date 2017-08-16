import CurrencyMap from '../CurrencyMap';

export default class {
  /**
   * Round price to two decimal places
   *
   * @param {string} price Price to Round
   * @return {string}
   */
  static round(price) {
    // If price is below 0, do not round and show all decimal places
    if (String(price).split('.')[0] === '0') return price;
    return Number(price).toFixed(2);
  }

  /**
   * Gets associated information about currency from symbol
   *
   * @param {string} symbol User inputted symbol
   * @return {object}
   */
  static mapCurrency(symbol) {
    let returnData = null;
    const keys = CurrencyMap.keys();
    for (let i = 0; i < CurrencyMap.size; i++) {
      const val = keys.next().value;
      if (val.indexOf(symbol.toUpperCase()) > -1) {
        returnData = {
          symbols: val,
          name: CurrencyMap.get(val),
        };
      }
    }
    return returnData;
  }
}
