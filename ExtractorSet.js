/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

function *checkExtractorListCanCrawlUrl(self, url) {
  for (const [extractor] of self.extractorSet.entries()) {
    yield extractor.canCrawlUrl(url).then(canCrawlUrl => ({
      canCrawlUrl,
      extractor,
    }));
  }
}

class ExtractorSet {
  constructor(extractors) {
    this.extractorSet = new Set(extractors);
  }

  findExtractorListForUrl(url) {
    return Promise.all(checkExtractorListCanCrawlUrl(this, url))
      .then(extractorList => extractorList.filter(extractor => extractor.canCrawlUrl))
      .then(extractorList => extractorList.map(extractor => extractor.extractor))
    ;
  }
}

module.exports = ExtractorSet;
