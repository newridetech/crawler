/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const Task = require('../Task');

class ExtractorSession extends Task {
  constructor(extractor, url) {
    super();

    this.extractor = extractor;
    this.url = url;
  }

  run() {
    return this.extractor.extractFromUrl(this.url)
      .then(this.resolve)
      .catch(this.reject)
    ;
  }
}

module.exports = ExtractorSession;
