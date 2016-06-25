/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

class Extractor {
  canCrawlUrl() {
    return Promise.resolve(false);
  }

  extractFromUrl(urlListDuplexStream, dataBus, url) {
    return Promise.reject(new Error(`Not yet implemented: ${url}`));
  }
}

module.exports = Extractor;
