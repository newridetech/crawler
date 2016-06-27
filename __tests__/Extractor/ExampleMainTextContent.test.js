/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const Crawler = require('../../Crawler');
const DataBus = require('../../EventEmitter/DataBus');
const ExampleMainTextContentExtractor = require('../../Extractor/ExampleMainTextContent');
const ExtractorSet = require('../../ExtractorSet');
const httpServer = require('http-server');
const path = require('path');
const test = require('lookly-preset-ava/test');
const UrlListDuplexStream = require('../../UrlListDuplexStream');

let server;

test.after.cb(t => {
  server.server.close(t.end);
});

test.before.cb(t => {
  server = httpServer.createServer({
    root: path.resolve(__dirname, '..', '..', '__fixtures__'),
  });

  server.listen(t.end);
});

test('should crawl given links', t => {
  const dataBus = new DataBus();
  const extractorSet = new ExtractorSet([
    new ExampleMainTextContentExtractor(),
  ]);
  const urlList = [
    `http://localhost:${server.server.address().port}/helloworld.html?p=0`,
    `http://localhost:${server.server.address().port}/helloworld.html?p=1`,
    `http://localhost:${server.server.address().port}/helloworld.html?p=2`,
    `http://localhost:${server.server.address().port}/helloworld.html?p=3`,
  ];
  const urlListDuplexStream = new UrlListDuplexStream();
  const crawler = new Crawler(dataBus, extractorSet);

  t.plan(urlList.length);
  dataBus.addListener('main', datagram => {
    t.is(datagram.data, 'Hello!');
    datagram.resolve();
  });

  urlListDuplexStream.feed(urlList);

  return crawler.run(urlListDuplexStream);
});
