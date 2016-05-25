/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

class ExtractorToHostSet extends Set {
  findExtractorListForUrl(url) {
    const ret = [];

    for (const val of this.values()) {
      if (val.hostPattern.test(url)) {
        ret.push(val.hostExtractor);
      }
    }

    return ret;
  }
}

module.exports = ExtractorToHostSet;
