import GDAX from './GDAX';
import CoinMarketCap from './CoinMarketCap';
import Kraken from './Kraken';

class NotRecognizedMarket {
  constructor(market) {
    this.market = market;
  }
  getCurrency(currency) {
    return Promise.reject(`Market ${this.market} not supported.`)
  }
}

export default class PortfolioResolver {
  constructor({market = "cmc"}) {
    this.market = market;
  }

  getAssetValuesForPositions(positions) {
    let notSupportedTickers = [];
    const allAssetValueResolvers = Object.keys(positions).map(symbol => {
      return this.getAssetValueForTickerAndPosition(symbol.toUpperCase(), positions[symbol])
        .then(successValue => Promise.resolve(successValue), errorMessage => {
          if (errorMessage == "Asset not found.") {
            notSupportedTickers.push(symbol);
            return Promise.resolve();
          } else {
            return Promise.reject(errorMessage);
          }
        });
    });
    return Promise.all(allAssetValueResolvers).then(assetValues => {
      return {
        assets: assetValues.filter(n => n),
        notSupported: notSupportedTickers
      }
    });
  }

  getAssetValueForTickerAndPosition(ticker, position) {
    return this.getCurrencyDataForTicker(ticker).then(priceData => {
      priceData.value = priceData.price * position;
      return priceData;
    });
  }

  getCurrencyDataForTicker(ticker) {
    return this.currencyResolver.getCurrency(ticker).then(priceData => {
      return {
        symbol: priceData.symbol,
        price:  priceData.price_usd,
        value: -1,
        change: priceData && priceData.percent_change_24h,
      };
    })
  }

  get currencyResolver() {
    if (this.market === 'gdax') {
      return GDAX;
    } else if (this.market === 'kraken') {
      return Kraken;
    } else if (this.market === 'cmc') {
      return CoinMarketCap;
    } else {
      return new NotRecognizedMarket(this.market);
    }
  }
}
