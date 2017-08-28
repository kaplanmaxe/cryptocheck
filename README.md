# Cryptocheck

A command line tool to check prices of cryptocurrencies.

### About

Cryptocheck allows you to check prices of cyrptocurrencies via command line. It currently has support for:

* GDAX
* CoinMarketCap.com

### Installation

```
npm install -g cryptocheck
```

### Usage

ALWAYS pass the symbol to the tool. The command will return an error if you pass the full currency name.

GDAX:

```
cryptocheck gdax btc
cryptocheck gdax eth
cryptocheck gdax ltc
```

CoinMarketCap.com
```
cryptocheck cmc sc
cryptocheck cmc xrp
```

Portfolio Check:

Add all your currencies in json file (sample file is in data/portfolio.json), you will overview of your portfolio.
```
cryptocheck portfolio <path-to-json-file>
```
You can check for specific market by providing option as below, default market is coinmarketcap. You can change it to gdax/kraken. Note: Not all currencies are supported in all markets :(
    
```    
cryptocheck portfolio -m cmc <path-to-json-file>
```

### Development

PRs are more than welcome! Just make sure to run gulp while developing to transpile and follow ESLint rules.

### Authors

- Max Kaplan: [@maxekaplan](https://twitter.com/maxekaplan)
