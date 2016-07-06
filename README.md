# crawler.absolvent.pl

## Quick Start

### entry point

```JavaScript
/* global extractorList, urlList */

// po to tu jestesmy
const Crawler = require('crawler.absolvent.pl/Crawler');

// szyna danych, ktora bedzie wysylac dane z crawlera do swiata zewnetrznego,
// np uslugi API
const DataBus = require('crawler.absolvent.pl/EventEmitter/DataBus');

// zestaw extractorow, ktore beda wyciagac informacje z konkretnych
// crawlowanych stron
const ExtractorSet = require('crawler.absolvent.pl/ExtractorSet');

// lista urli, strumien dwukierunkowy, mozna z niego odczytywac adresy i
// dorzucac je do listy
const UrlListDuplexStream = require('crawler.absolvent.pl/UrlListDuplexStream');

const dataBus = new DataBus();
const extractorSet = new ExtractorSet(extractorList);
const crawler = new Crawler(dataBus, extractorSet);
const urlListDuplexStream = new UrlListDuplexStream();

// strumen URLi karmimy poczatkowa lista adresow, od ktorej crawler ma zaczac
// zwiedzanie stron
urlListDuplexStream.feed(urlList);

// tutaj beda trafiac dane
dataBus.addListener('someIncomingData', datagram => {
  // tutaj obslugujemy przychodzace dane

  // po obsluzeniu danych z sukcesem trzeba wywolac funkcje .resolve()
  datagram.resolve();
  // po porazce
  datagram.reject();
  // datagram.resolve / .reject moga byc wywolane asynchronicznie
});

crawler.run(urlListDuplexStream);
```

### Extractor

Przykładowo, wyciąganie `H1` z http://example.com.

#### fetch

```JavaScript
const $ = require('cheerio');
const Extractor = require('crawler.absolvent.pl/Extractor');
const fetch = require('node-fetch');

class ExampleExtractor extends Extractor {
  canCrawlUrl(url) {
    return Promise.resolve(/example.com/.test(url));
  }

  extractFromUrl(urlListDuplexStream, dataBus, url) {
    return fetch(url)
      .then(response => response.text())
      .then(response => $(response))
      .then($response => $response.find('h1').text())
      .then(h1Text => dataBus.push('pageText', h1Text))
    ;
  }
}
```

#### Nightmare

Nightmare należy używać TYLKO jeżeli wariant z `fetch` nie działa (np strona
wymaga JS do wyrenderowania).

```JavaScript
const Extractor = require('crawler.absolvent.pl/Extractor');
const Nightmare = require('nightmare');

class ExampleExtractor extends Extractor {
  canCrawlUrl(url) {
    return Promise.resolve(/example.com/.test(url));
  }

  extractFromUrl(urlListDuplexStream, dataBus, url) {
    return new Nightmare()
      .goto(url)
      .evaluate(() => document.querySelector('h1').textContent)
      .end()
      .then(h1Text => dataBus.push('pageText', h1Text))
    ;
  }
}
```

## Public API

### [crawler.absolvent.pl/Crawler](Crawler.js)

```JavaScript
class Crawler {
  constructor(
    dataBus: crawler.absolvent.pl/EventEmitter/DataBus,
    extractorSet: crawler.absolvent.pl/ExtractorSet
  )
  run(urlListDuplexStream: crawler.absolvent.pl/UrlListDuplexStream): Promise
}
```

### [crawler.absolvent.pl/EventEmitter/DataBus](EventEmitter/DataBus.js)

```JavaScript
class DataBus {
  pushData(name: string, data: any): Promise
}
```

### [crawler.absolvent.pl/Extractor](Extractor.js)

Po `crawler.absolvent.pl/Extractor` muszą dziedziczyć wszystkie extractory.

```JavaScript
abstract class Extractor {
  // określa, czy Extractor jest w stanie wyciągnąć dane z oferty, trafi tutaj
  // każdy URL z urlListDuplexStream
  abstract canCrawlUrl(url: string): Promise<bool>

  // funkcja wyciąga dane z URL, powinna wypychać je przez dataBus#pushData
  abstract extractFromUrl(
    urlListDuplexStream: crawler.absolvent.pl/UrlListDuplexStream,
    dataBus: crawler.absolvent.pl/EventEmitter/DataBus,
    url: string
  ): Promise
}
```
