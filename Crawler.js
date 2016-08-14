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
const ExtractorSet = require('./ExtractorSet');
const isNull = require('lodash/isNull');
const Logger = require('./Logger');
const through2 = require('through2');
const UrlListDuplexStream = require('./UrlListDuplexStream');

class Crawler {
  constructor(dataBus, extractorSet, logger = new Logger(), extractorScheduler = null) {
    if (isNull(extractorScheduler)) {
      this.extractorScheduler = new ExtractorScheduler(void 0, logger);
    } else {
      assert.instanceOf(extractorScheduler, ExtractorScheduler);
      this.extractorScheduler = extractorScheduler;
    }

    assert.instanceOf(dataBus, DataBus);
    assert.instanceOf(extractorSet, ExtractorSet);

    this.dataBus = dataBus;
    this.extractorSet = extractorSet;
  }

  onUrlListDuplexStreamData(urlListDuplexStream, url, callback) {
    return this.extractorSet.findExtractorListForUrl(url)
      .then(extractorList => {
        for (const extractor of extractorList) {
          this.extractorScheduler.schedule(new ExtractorSession(
            urlListDuplexStream,
            this.dataBus,
            extractor,
            url
          ));
        }
      })
      .then(() => this.extractorScheduler.awaitCanRunExtractor())
      .then(callback)
    ;
  }

  onUrlListDuplexStreamEnd() {
    return this.extractorScheduler.flush();
  }

  run(urlListDuplexStream) {
    return new Promise((resolve, reject) => {
      assert.instanceOf(urlListDuplexStream, UrlListDuplexStream);

      urlListDuplexStream
        .pipe(through2.obj((url, encoding, callback) => (
          this.onUrlListDuplexStreamData(urlListDuplexStream, url, callback)
        )))
        .on('end', () => this.onUrlListDuplexStreamEnd().then(resolve))
        .on('error', reject)
      ;
      this.extractorScheduler.once(ExtractorScheduler.EVENT_DEPLETED, resolve);
    });
  }
}

module.exports = Crawler;
