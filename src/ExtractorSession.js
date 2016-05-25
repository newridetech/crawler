/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

class ExtractorSession extends Promise {
  constructor(extractor, url) {
    let thisReject;
    let thisResolve;

    super(function (resolve, reject) {
      thisResolve = resolve;
      thisReject = reject;
    });

    this.done = thisResolve.bind(this);
    this.fail = thisReject.bind(this);
    this.url = url;
  }

  pushData(name, data) {
    console.log(name, data);
  }

  start() {
  }
}

module.exports = ExtractorSession;
