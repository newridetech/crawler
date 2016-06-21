/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const Crawler = require('../Crawler');
const DataBus = require('../EventEmitter/DataBus');
const ExampleMainTextContentExtractor = require('../Extractor/ExampleMainTextContent');
const ExtractorScheduler = require('../EventEmitter/ExtractorScheduler');
const ExtractorToHostSet = require('../ExtractorToHostSet');
const httpServer = require('http-server');
const UrlListDuplexStream = require('../UrlListDuplexStream');
const path = require('path');
const test = require('lookly-preset-ava/test');

let server;

test.after.cb(t => {
  server.server.close(t.end);
});

test.before.cb(t => {
  server = httpServer.createServer({
    root: path.resolve(__dirname, '..', '__fixtures__'),
  });

  server.listen(t.end);
});

test('should crawl given links', t => {
  const dataBus = new DataBus();
  const extractorScheduler = new ExtractorScheduler({
    capacityLimit: 3,
  });
  const extractorToHostSet = new ExtractorToHostSet([
    {
      hostExtractor: new ExampleMainTextContentExtractor(),
      hostPattern: /localhost:([0-9]+)\/index.html/,
    },
  ]);
  const urlList = [
    `http://localhost:${server.server.address().port}/index.html?p=0`,
    `http://localhost:${server.server.address().port}/index.html?p=1`,
    `http://localhost:${server.server.address().port}/index.html?p=2`,
    `http://localhost:${server.server.address().port}/index.html?p=3`,
  ];
  const urlListDuplexStream = new UrlListDuplexStream();
  const crawler = new Crawler(dataBus, extractorScheduler, extractorToHostSet);

  t.plan(urlList.length);
  dataBus.addListener('main', datagram => {
    t.is(datagram.data, 'Hello!');
    datagram.resolve();
  });
  urlListDuplexStream.feed(urlList);

  return crawler.run(urlListDuplexStream);
});
