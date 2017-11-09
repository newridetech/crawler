# crawler.newride.tech

## How to start crawling?

To start crawling and extract data from sites you need to create a data
extractor that is capable of handling given website and plug it into the
crawler engine. Then you can read incoming data from `dataBus`.

1. code your data extractor

This extractor reads `h1` title from `example.com` and pushes it into the
`dataBus` as `'website header'`.

```js
const Extractor = require('crawler.newride.tech/Extractor');

const MyExtractor extends Extractor {
  canCrawlUrl(url) {
    return Promise.resolve(/example.com\/index.html/.test(url));
  }

  extractFromUrl(urlListDuplexStream, dataBus, url) {
    return new Nightmare()
      .goto(url)
      .evaluate(() => document.querySelector('h1').textContent)
      .end()
      .then(textContent => dataBus.pushData('website header', textContent))
    ;
  }
}

module.exports = MyExtractor;
```

2. setup crawler engine

```js
const Crawler = require('crawler.newride.tech/Crawler');
const DataBus = require('crawler.newride.tech/EventEmitter/DataBus');
const ExtractorSet = require('crawler.newride.tech/ExtractorSet');
const UrlListDuplexStream = require('crawler.newride.tech/UrlListDuplexStream');

// your extractor
const MyExtractor = require('./MyExtractor');

const dataBus = new DataBus();

dataBus.addListener('website header', datagram => {
    console.log(datagram.data); // 'Example Domain'
    datagram.resolve();
});

const crawler = new Crawler(dataBus, new ExtractorSet([
    new MyExtractor()
]));

const urlListDuplexStream = new UrlListDuplexStream();

urlListDuplexStream.feed([
    'http://example.com'
]);

crawler.run(urlListDuplexStream);
```
