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
  onUrlListDuplexStreamData(url) {
    console.log('onUrlListDuplexStreamData', url);
  }

  onSessionEnd(callback) {
    this.on('session.end', callback);
  }

  onUrlListDuplexStreamEnd() {
    this.emit('session.end');
  }
}

module.exports = CrawlerManagerSession;
