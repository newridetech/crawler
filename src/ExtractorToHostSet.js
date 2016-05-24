/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

class ExtractorToHostSet extends Set {
  findExtractorForUrl(url) {
    for (let value of this.values()) {
      if (value.hostPattern.test(url)) {
        return value.hostExtractor;
      }
    }
  }
}

module.exports = ExtractorToHostSet;
