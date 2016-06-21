/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

class ExtractorToHostSet extends Set {
  *findExtractorListForUrl(url) {
    for (const [val] of this.entries()) {
      if (val.hostPattern.test(url)) {
        yield val.hostExtractor;
      }
    }
  }
}

module.exports = ExtractorToHostSet;