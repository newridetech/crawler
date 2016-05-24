/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const EventEmitter = require('events');

class CrawlerManagerSession extends EventEmitter {
  constructor(extractorToHostSet) {
    super();

    this.extractorToHostSet = extractorToHostSet;
  }

  addListenerSessionEnd(callback) {
    this.on('session.end', callback);
  }

  onUrlListDuplexStreamData(stream, url, callback) {
    return this.extractorToHostSet
      .findExtractorForUrl(url)
      .extractFromUrl(stream, url)
      .catch(callback)
      .then(() => callback())
    ;
  }

  onUrlListDuplexStreamEnd() {
    this.emit('session.end');
  }
}

module.exports = CrawlerManagerSession;
