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

  onUrlListDuplexStreamData(urlListDuplexStream, url, callback) {
    for (const extractor of this.extractorToHostSet.findExtractorListForUrl(url)) {
      this.extractorScheduler.schedule(new ExtractorSession(
        urlListDuplexStream,
        this.dataBus,
        extractor,
        url
      ));
    }

    return this.extractorScheduler.onceHasCapacity(callback);
  }

  onUrlListDuplexStreamEnd() {
    this.extractorScheduler.flush();
  }

  run(urlListDuplexStream) {
    return new Promise((resolve, reject) => {
      assert.instanceOf(urlListDuplexStream, UrlListDuplexStream);

      urlListDuplexStream
        .pipe(through2.obj((url, encoding, callback) => (
          this.onUrlListDuplexStreamData(urlListDuplexStream, url, callback)
        )))
        .on('end', resolve)
        .on('error', reject)
      ;
      this.extractorScheduler.once(ExtractorScheduler.EVENT_DEPLETED, resolve);
    });
  }
}

module.exports = CrawlerSession;