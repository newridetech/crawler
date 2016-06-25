/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const EventEmitter = require('events');
const os = require('os');

class ExtractorScheduler extends EventEmitter {
  constructor(props = { parallelLimit: os.cpus().length }) {
    super();

    this.parallelLimit = props.parallelLimit;
    this.runningExtractorSessionSet = new Set();
    this.scheduledExtractorSessionSet = new Set();
  }

  checkCanRunExtractor() {
    return Promise.resolve(this.runningExtractorSessionSet.size < this.parallelLimit);
  }

  flush() {
    return this.checkCanRunExtractor().then(canRunExtractor => {
      if (!canRunExtractor) {
        return null;
      }

      for (const [scheduledExtractorSession] of this.scheduledExtractorSessionSet.entries()) {
        this.scheduledExtractorSessionSet.delete(scheduledExtractorSession);

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

  onceHasCapacity(callback) {
    return this.checkCanRunExtractor().then(canRunExtractor => (
      canRunExtractor ? (
        callback()
      ) : (
        this.once(ExtractorScheduler.EVENT_CAPACITY, callback)
      )
    ));
  }

  runExtractorSession(extractorSession) {
    this.runningExtractorSessionSet.add(extractorSession);

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
