# crawler.newride.tech

## How to start crawling?

To start crawling and extract data from sites you need to create a data
extractor that is capable of handling given resource and plug it into the
crawler engine. Then you can read incoming data from `dataBus`.

### code your data extractor

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

### setup crawler engine

To work, crawler needs `UrlListDuplexStream`, `DataBus` and `ExtractorSet`.
Those are basic and necessary objects for the mechanism to work and each one
of them plays its own role in the crawling process.

#### why not just one Crawler object?

Using several classess, their concerns are separated and can operate
independently. Only combined together they make a Crawler that is able to
extract data from various sources efficiently.

#### what is the exact role of each of those objects?

`Crawler` - orchestrates and manages `DataBus`, `ExtractorSet` and
`UrlListDuplexStream` to work together. It's the only object able to keep
everyting together and start the crawling process.

`DataBus` - its sole purpose is to transfer data. Since all crawling happens
asynchronously you can never know when the desired data arrives. `DataBus` will
notify you at the exact moment any extractor finds the information you are
waiting for.
For `DataBus` by design there is no difference how the data is obtained and
when it's published. Thanks to that it does not enforce any implementation on
Extractors.

`ExtractorSet` - each `Extractor` must specify what kind of resource it can
handle. `ExtractorSet` keeps all the `Extractors` together and when asked it
points the `Extractors` that can handle the given resource (website for
example).

`UrlListDuplexStream` - keeps track of the links that are going to be crawled.
If you start crawling with empty `UrlListDuplexStream` then `Crawler` will stop
immediately since it has nothing to do.
`UrlListDuplexStream` is a FIFO queueu that feeds links to the `Crawler` until
it's empty. You can push more links into `UrlListDuplexStream` while crawling.
Thanks to that you can crawl resources list using one extractor and then push
the links to individual resources into `UrlListDuplexStream` so other
`Extractors` can crawl them.
Crawling stops when `UrlListDuplexStream` is empty.

#### how to implement this?

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
