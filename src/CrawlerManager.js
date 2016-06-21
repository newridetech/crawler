/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const assert = require('chai').assert;
const CrawlerManagerSession = require('./CrawlerManagerSession');
const DataBus = require('./EventEmitter/DataBus');
const ExtractorScheduler = require('./EventEmitter/ExtractorScheduler');
const ExtractorToHostSet = require('./ExtractorToHostSet');

class CrawlerManager {
  constructor(dataBus, extractorScheduler, extractorToHostSet) {
    assert.instanceOf(dataBus, DataBus);
    assert.instanceOf(extractorScheduler, ExtractorScheduler);
    assert.instanceOf(extractorToHostSet, ExtractorToHostSet);

    this.dataBus = dataBus;
    this.extractorScheduler = extractorScheduler;
    this.extractorToHostSet = extractorToHostSet;
  }

  run(urlListDuplexStream) {
    return new CrawlerManagerSession(
      this.dataBus,
      this.extractorScheduler,
      this.extractorToHostSet
    ).run(urlListDuplexStream);
  }
}

module.exports = CrawlerManager;
