/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

/* global after: false, before: false, describe: false, it: false */

// const assert = require('chai').assert;
const CrawlerManager = require('../CrawlerManager');
const ExampleMainTextContentExtractor = require('../Extractor/ExampleMainTextContent');
const ExtractorScheduler = require('../ExtractorScheduler');
const ExtractorToHostSet = require('../ExtractorToHostSet');
const httpServer = require('http-server');
const UrlListDuplexStream = require('../UrlListDuplexStream');
const path = require('path');

describe('CrawlerManager', function () {
  let server;

  after(function (done) {
    server.server.close(done);
  });

  before(function (done) {
    server = httpServer.createServer({
      root: path.resolve(__dirname, '..', '__fixtures__'),
    });

    server.listen(done);
  });

  it('should crawl given links', function (done) {
    this.timeout(10000);

    const extractorScheduler = new ExtractorScheduler();
    const extractorToHostSet = new ExtractorToHostSet([
      {
        hostExtractor: new ExampleMainTextContentExtractor(),
        hostPattern: /localhost:([0-9]+)\/index.html/,
      },
    ]);
    const urlListDuplexStream = new UrlListDuplexStream();
    const crawlerManager = new CrawlerManager(extractorScheduler, extractorToHostSet);

    urlListDuplexStream.feed([
      `http://localhost:${server.server.address().port}/index.html?p=0`,
      `http://localhost:${server.server.address().port}/index.html?p=1`,
      `http://localhost:${server.server.address().port}/index.html?p=2`,
      `http://localhost:${server.server.address().port}/index.html?p=3`,
    ]);

    crawlerManager
      .run(urlListDuplexStream)
      .addListenerSessionEnd(done)
    ;
  });
});
