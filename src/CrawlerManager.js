/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const assert = require('chai').assert;
const CrawlerManagerSession = require('./Task/CrawlerManagerSession');
const ExtractorScheduler = require('./EventEmitter/ExtractorScheduler');
const ExtractorToHostSet = require('./ExtractorToHostSet');

class CrawlerManager {
  constructor(extractorScheduler, extractorToHostSet) {
    assert.instanceOf(extractorScheduler, ExtractorScheduler);
    assert.instanceOf(extractorToHostSet, ExtractorToHostSet);

    this.extractorScheduler = extractorScheduler;
    this.extractorToHostSet = extractorToHostSet;
  }

  run(urlListDuplexStream) {
    return new CrawlerManagerSession(
      this.extractorScheduler,
      this.extractorToHostSet,
      urlListDuplexStream
    );
  }
}

module.exports = CrawlerManager;
