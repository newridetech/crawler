/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

/* eslint new-cap: 0 */
/* global after: false, before: false, describe: false, it: false */

// const assert = require('chai').assert;
const CrawlerManager = require('../CrawlerManager');
const ExampleMainTextContentExtractor = require('../Extractor/ExampleMainTextContent');
const ExtractorToHostSet = require('../ExtractorToHostSet');
const httpServer = require('http-server');
const MemoryUrlListDuplexStream = require('../UrlListDuplexStream/Memory');
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
    const extractorToHostSet = new ExtractorToHostSet([
      {
        hostExtractor: new ExampleMainTextContentExtractor(),
        hostPattern: /localhost:([0-9]+)\/index.html/,
      }
    ]);
    const urlListDuplexStream = new MemoryUrlListDuplexStream();
    const crawlerManager = new CrawlerManager();

    urlListDuplexStream.feed([
      `http://localhost:${server.server.address().port}/index.html`,
    ]);

    crawlerManager
      .run(extractorToHostSet, urlListDuplexStream)
      .addListenerSessionEnd(done)
    ;
  });
});
