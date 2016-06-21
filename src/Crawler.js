/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const assert = require('chai').assert;
const DataBus = require('./EventEmitter/DataBus');
const ExtractorScheduler = require('./EventEmitter/ExtractorScheduler');
const ExtractorSession = require('./ExtractorSession');
const ExtractorToHostSet = require('./ExtractorToHostSet');
const through2 = require('through2');
const UrlListDuplexStream = require('./UrlListDuplexStream');

class CrawlerSession {
  constructor(dataBus, extractorScheduler, extractorToHostSet) {
    assert.instanceOf(dataBus, DataBus);
    assert.instanceOf(extractorScheduler, ExtractorScheduler);
    assert.instanceOf(extractorToHostSet, ExtractorToHostSet);

    this.dataBus = dataBus;
    this.extractorScheduler = extractorScheduler;
    this.extractorToHostSet = extractorToHostSet;
  }

  onUrlListDuplexStreamData(stream, url, callback) {
    const extractorList = this.extractorToHostSet.findExtractorListForUrl(url);

    for (const extractor of extractorList) {
      this.extractorScheduler.schedule(new ExtractorSession(this.dataBus, extractor, url));
    }

    this.extractorScheduler.once(ExtractorScheduler.EVENT_CAPACITY, callback);
  }

  onUrlListDuplexStreamEnd() {
    this.extractorScheduler.flush();
  }

  run(urlListDuplexStream) {
    const session = this;

    return new Promise((resolve, reject) => {
      assert.instanceOf(urlListDuplexStream, UrlListDuplexStream);

      urlListDuplexStream
        .pipe(through2.obj(function streamTransformer(url, encoding, callback) {
          session.onUrlListDuplexStreamData(this, url, callback);
        }))
        .on('end', resolve)
        .on('error', reject)
      ;
      this.extractorScheduler.once(ExtractorScheduler.EVENT_DEPLETED, resolve);
    });
  }
}

module.exports = CrawlerSession;
