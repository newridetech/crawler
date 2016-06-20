/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const assert = require('chai').assert;
const ExtractorScheduler = require('../ExtractorScheduler');
const ExtractorSession = require('./ExtractorSession');
const ExtractorToHostSet = require('../ExtractorToHostSet');
const Task = require('../Task');
const through2 = require('through2');
const UrlListDuplexStream = require('../UrlListDuplexStream');

class CrawlerManagerSession extends Task {
  constructor(extractorScheduler, extractorToHostSet, urlListDuplexStream) {
    super();

    assert.instanceOf(extractorScheduler, ExtractorScheduler);
    assert.instanceOf(extractorToHostSet, ExtractorToHostSet);
    assert.instanceOf(urlListDuplexStream, UrlListDuplexStream);

    this.extractorScheduler = extractorScheduler;
    this.extractorToHostSet = extractorToHostSet;

    const session = this;

    urlListDuplexStream
      .pipe(through2.obj(function (url, encoding, callback) {
        session.onUrlListDuplexStreamData(this, url, callback);
      }))
      .on('data', data => console.log(data))
      .on('end', this.resolve)
    ;
  }

  onUrlListDuplexStreamData(stream, url, callback) {
    const extractorList = this.extractorToHostSet.findExtractorListForUrl(url);

    for (const extractor of extractorList) {
      this.extractorScheduler.schedule(new ExtractorSession(extractor, url));
    }

    this.extractorScheduler.addListenerHasCapacityOnce(callback);
  }

  onUrlListDuplexStreamEnd() {
    this.extractorScheduler.flush();
  }
}

module.exports = CrawlerManagerSession;
