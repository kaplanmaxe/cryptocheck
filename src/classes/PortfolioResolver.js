import GDAX from './GDAX';
import CoinMarketCap from './CoinMarketCap';
import Kraken from './Kraken';

class NotRecognizedMarket {
  /**
   * Null Object pattern for unrecognized market.
   *
   * @param {string} market The market that wasn't recognized
   */
  constructor(market) {
    this.market = market;
  }

  /* eslint-disable no-unused-vars */

  /**
   * Returns a failed promise explaining the problem.
   *
   * @param {string} Currency Currency to fetch
   * @return {Promise}
   */
  getCurrency(currency) {
    return Promise.reject(`Market ${this.market} not supported.`);
  }
  /* eslint-enable */
}

export default class PortfolioResolver {
  /**
   * Deals with fetching the required information for the portfolio command.
   *
   * @param {string} market The market that wasn't recognized
   */
  constructor({ market = 'cmc' }) {
    this.market = market;
  }

  /**
   * Looks up the passed in assets and calculates that positions'
   * worth.
   *
   * @param {object} Positions Maps ticker symbol to position.
   * @return {Promise}
   */
  getAssetValuesForPositions(positions) {
    const notSupportedTickers = [];
    const allAssetValueResolvers = Object.keys(positions).map(symbol => {
      return this.getAssetValueForTickerAndPosition(symbol.toUpperCase(), positions[symbol])
        .then(successValue => Promise.resolve(successValue), // eslint-disable-line arrow-body-style
              errorMessage => {
          if (errorMessage === 'Asset not found.') {
            notSupportedTickers.push(symbol);
            return Promise.resolve();
          }
          return Promise.reject(errorMessage);
        });
    });
    return Promise.all(allAssetValueResolvers).then(assetValues => {
      return {
        assets: assetValues.filter(n => n), // eslint-disable-line arrow-body-style
        notSupported: notSupportedTickers,
      };
    });
  }

  /**
   * Looks up the passed in ticker symbol and calculates that position's
   * worth.
   *
   * @param {string} Ticker The symbol to look up
   * @param {position} Position The portfolio position
   * @return {Promise}
   */
  getAssetValueForTickerAndPosition(ticker, position) {
    return this.getCurrencyDataForTicker(ticker).then(priceData => {
      priceData.value = priceData.price * position;
      return priceData;
    });
  }

  /**
   * Uses the proper currency market to look up the ticker.
   *
   * @param {string} Ticker The symbol to look up
   * @return {Promise}
   */
  getCurrencyDataForTicker(ticker) {
    return this.currencyResolver.getCurrency(ticker).then(priceData => {
      return {
        symbol: priceData.symbol,
        price: priceData.price_usd,
        value: -1,
        change: priceData && priceData.percent_change_24h,
      };
    });
  }

  /**
   * Returns the market api that is requested.
   *
   * @return {object}
   */
  get currencyResolver() {
    if (this.market === 'gdax') {
      return GDAX;
    } else if (this.market === 'kraken') {
      return Kraken;
    } else if (this.market === 'cmc') {
      return CoinMarketCap;
    }
    return new NotRecognizedMarket(this.market);
  }
}
