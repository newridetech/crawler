/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const EventEmitter = require('events');

class ExtractorScheduler extends EventEmitter {
  constructor() {
    super();

    this.handleExtractorSessionFinish = this.handleExtractorSessionFinish.bind(this);
    this.scheduledExtractorSessionSet = new Set();
  }

  addListenerHasCapacityOnce(callback) {
    this.once('capacity', callback);
    this.notifyOnceIfHasCapacity();
  }

  checkHasCapacity() {
    return Promise.resolve(this.scheduledExtractorSessionSet.size < 1);
  }

  flush() {
    console.log('extractor scheduler flush', this.scheduledExtractorSessionSet);
  }

  handleExtractorSessionFinish(extractorSession) {
    this.scheduledExtractorSessionSet.delete(extractorSession);

    return this.notifyOnceIfHasCapacity();
  }

  notifyOnceIfHasCapacity() {
    this.checkHasCapacity().then(hasCapacity => {
      if (hasCapacity) {
        this.emit('capacity');
      }

      return hasCapacity;
    });
  }

  schedule(extractorSession) {
    this.scheduledExtractorSessionSet.add(extractorSession);
    extractorSession.start();
  }
}

module.exports = ExtractorScheduler;
