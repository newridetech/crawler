/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const EventEmitter = require('events');

const CAPACITY_LIMIT = 1;

class ExtractorScheduler extends EventEmitter {
  constructor() {
    super();

    this.runningExtractorSessionSet = new Set();
    this.scheduledExtractorSessionSet = new Set();
  }

  addListenerHasCapacityOnce(callback) {
    this.once('capacity', callback);
  }

  checkCanRunExtractor() {
    return Promise.resolve(this.runningExtractorSessionSet.size < CAPACITY_LIMIT);
  }

  flush() {
    return this.checkCanRunExtractor().then(canRunExtractor => {
      if (!canRunExtractor) {
        return null;
      }

      for (const [scheduledExtractorSession] of this.scheduledExtractorSessionSet.entries()) {
        this.scheduledExtractorSessionSet.delete(scheduledExtractorSession);
        this.runningExtractorSessionSet.add(scheduledExtractorSession);

        return scheduledExtractorSession.run().then(() => this.flush());
      }

      this.emit('capacity');

      return null;
    });
  }

  handleExtractorSessionError(extractorSession) {
    return this.extractorScheduler.handleExtractorSessionFinish(extractorSession);
  }

  handleExtractorSessionFinish(extractorSession) {
    this.runningExtractorSessionSet.delete(extractorSession);

    return this.flush();
  }

  schedule(extractorSession) {
    extractorSession.catch(this.handleExtractorSessionError.bind(this, extractorSession));
    extractorSession.then(this.handleExtractorSessionFinish.bind(this, extractorSession));
    this.scheduledExtractorSessionSet.add(extractorSession);

    return this.flush();
  }
}

module.exports = ExtractorScheduler;
