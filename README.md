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

### Development

PRs are more than welcome! Just make sure to run gulp while developing to transpile and follow ESLint rules.

### Authors

- Max Kaplan: [@maxekaplan](https://twitter.com/maxekaplan)
