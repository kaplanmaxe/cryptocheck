# Cryptocheck

A command line tool to check prices of cryptocurrencies.

### About

Cryptocheck allows you to check prices of cyrptocurrencies via command line. It currently has support for:

* Kraken
* GDAX
* CoinMarketCap.com

### Installation

```
npm install -g cryptocheck
```

### Usage

ALWAYS pass the symbol to the tool. The command will return an error if you pass the full currency name.

Kraken:

```
cryptocheck kraken btc
cryptocheck kraken eth
cryptocheck kraken ltc
```

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

To get overview of your portfolio, add all your currencies in json file (sample file is in data/portfolio.json), and run following command.
```
cryptocheck portfolio <path-to-json-file>
```

Returns:

```
symbol  price      value      change
------  ---------  ---------  ------
ETH     $348.33    $3483.30   -0.45%
BTC     $4388.93   $17555.72  1.14%
BCH     $594.93    $1308.85   -3.51%
LTC     $62.69     $642.58    1.15%
NEO     $38.21     $1146.38   -1.8%
DASH    $361.58    $3615.82   -0.72%
XEM     $0.284149  $4.55      3.96%
XRP     $0.217295  $10.86     7.64%
XMR     $140.73    $1407.30   1.9%  

Total: $29175.36
```

Example file is in `data/portfolio.json`.

You can check for specific market by providing option as below, default market is coinmarketcap. You can change it to gdax/kraken. Note: Not all currencies are supported in all markets :(

```    
cryptocheck portfolio -m cmc <path-to-json-file>
```

### Development

PRs are more than welcome! Just make sure to run gulp while developing to transpile and follow ESLint rules.

`npm run lint`
`npm run test` (You will need to run `npm link` first)

### Authors

- Max Kaplan: [@maxekaplan](https://twitter.com/maxekaplan)
