/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

class ExtractorSession {
  constructor(dataBus, extractor, url) {
    this.dataBus = dataBus;
    this.extractor = extractor;
    this.url = url;
  }

  run() {
    return Promise.resolve(this.extractor.extractFromUrl(this.dataBus, this.url));
  }
}

module.exports = ExtractorSession;
