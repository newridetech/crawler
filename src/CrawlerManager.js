/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const CrawlerManagerSession = require('./CrawlerManagerSession');

class CrawlerManager {
  onSessionEnd(callback) {
    this.on('session.end', callback);
  }

  run(urlListDuplexStream) {
    const session = new CrawlerManagerSession();

    urlListDuplexStream
      .on('data', data => session.onUrlListDuplexStreamData(data))
      .on('end', () => session.onUrlListDuplexStreamEnd())
    ;

    return session;
  }
}

module.exports = CrawlerManager;
