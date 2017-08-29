const exec = require('child_process').exec;
const assert = require('chai').assert;
const fs = require('fs');

const sources = ['kraken', 'gdax', 'cmc'];
const currencies = ['BTC', 'ETH', 'LTC'];

// Test all sources for given currencies
for (let i = 0; i < sources.length; i++) {
  describe(`Test ${sources[i]} functionality`, () => {
    for (let j = 0; j < currencies.length; j++) {
      it(`should output value for ${currencies[j]}`, done => {
        exec(`cryptocheck ${sources[i]} ${currencies[j]}`, (err, stdout) => {
          assert.notEqual(stdout, 'Asset not found.', 'Asset was found');
          assert.include(stdout, currencies[j], 'Symbol was included in output');
          const price = sources[i] === 'cmc' ? Number(stdout.split(' ')[2].split('$')[1])
            : Number(stdout.split('$')[1]);
          assert.isAbove(price, 0, 'Price is above 0');
          done();
        });
      }).timeout(5000);
    }
  });
}

describe('Test portfolio functionality', () => {
  const data = JSON.parse(fs.readFileSync('./data/portfolio.json', 'UTF-8'));
  const keys = Object.keys(data);
  it(`should output contain all currencies`, done => {
    exec('cryptocheck portfolio ./data/portfolio.json', (err, stdout) => {
      for (let i = 0; i < keys.length; i++) {
        assert.include(stdout, keys[i], 'Symbol was included in output');
      }
      done();
    });
  }).timeout(5000);
});
