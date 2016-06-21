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
const Extractor = require('./Extractor');
const UrlListDuplexStream = require('./UrlListDuplexStream');

class ExtractorSession {
  constructor(urlListDuplexStream, dataBus, extractor, url) {
    assert.instanceOf(dataBus, DataBus);
    assert.instanceOf(extractor, Extractor);
    assert.instanceOf(urlListDuplexStream, UrlListDuplexStream);

    this.dataBus = dataBus;
    this.extractor = extractor;
    this.url = url;
    this.urlListDuplexStream = urlListDuplexStream;
  }

  run() {
    return this.extractor.extractFromUrl(this.urlListDuplexStream, this.dataBus, this.url);
  }
}

module.exports = ExtractorSession;
