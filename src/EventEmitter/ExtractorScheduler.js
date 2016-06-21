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

        return this.runExtractorSession(scheduledExtractorSession);
      }

      return this.handleExtractorSchedulerCapacity();
    });
  }

  handleExtractorSchedulerCapacity() {
    this.emit(ExtractorScheduler.EVENT_CAPACITY);

    if (this.runningExtractorSessionSet.size + this.scheduledExtractorSessionSet.size < 1) {
      this.emit(ExtractorScheduler.EVENT_DEPLETED);
    }
  }

  handleExtractorSessionError(extractorSession, err) {
    return this.extractorScheduler
      .handleExtractorSessionFinish(extractorSession)
      .then(() => {
        throw err;
      })
    ;
  }

  handleExtractorSessionFinish(extractorSession) {
    this.runningExtractorSessionSet.delete(extractorSession);

    return this.flush();
  }

  runExtractorSession(extractorSession) {
    return extractorSession.run()
      .catch(err => this.handleExtractorSessionError(extractorSession, err))
      .then(() => this.handleExtractorSessionFinish(extractorSession))
    ;
  }

  schedule(extractorSession) {
    this.scheduledExtractorSessionSet.add(extractorSession);

    return this.flush();
  }
}

ExtractorScheduler.EVENT_CAPACITY = Symbol();
ExtractorScheduler.EVENT_DEPLETED = Symbol();

module.exports = ExtractorScheduler;
