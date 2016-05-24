/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const CrawlerManagerSession = require('./CrawlerManagerSession');
const through2 = require('through2');

class CrawlerManager {
  run(extractorToHostSet, urlListDuplexStream) {
    const session = new CrawlerManagerSession(extractorToHostSet);

    urlListDuplexStream
      .pipe(through2.obj(function (chunk, encoding, callback) {
        session.onUrlListDuplexStreamData(this, chunk, callback);
      }))
      .on('data', data => console.log(data))
      .on('end', () => session.onUrlListDuplexStreamEnd(urlListDuplexStream))
    ;

    return session;
  }
}

module.exports = CrawlerManager;
