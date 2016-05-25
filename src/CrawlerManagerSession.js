/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const assert = require('chai').assert;
const EventEmitter = require('events');
const ExtractorScheduler = require('./ExtractorScheduler');
const ExtractorSession = require('./ExtractorSession');
const ExtractorToHostSet = require('./ExtractorToHostSet');
const through2 = require('through2');
const UrlListDuplexStream = require('./UrlListDuplexStream');

class CrawlerManagerSession extends EventEmitter {
  constructor(extractorScheduler, extractorToHostSet, urlListDuplexStream) {
    super();

    const session = this;

    assert.instanceOf(extractorScheduler, ExtractorScheduler);
    assert.instanceOf(extractorToHostSet, ExtractorToHostSet);
    assert.instanceOf(urlListDuplexStream, UrlListDuplexStream);

    this.extractorScheduler = extractorScheduler;
    this.extractorToHostSet = extractorToHostSet;
    urlListDuplexStream
      .pipe(through2.obj(function (url, encoding, callback) {
        session.onUrlListDuplexStreamData(this, url, callback);
      }))
      .on('data', data => console.log(data))
      .on('end', () => session.onUrlListDuplexStreamEnd())
    ;
  }

  addListenerSessionEnd(callback) {
    this.on('session.end', callback);
  }

  onUrlListDuplexStreamData(stream, url, callback) {
    const extractorList = this.extractorToHostSet.findExtractorListForUrl(url);
    const extractorSessionList = [];

    for (const extractor of extractorList) {
      const extractorSession = new ExtractorSession(extractor, url);

      extractorSessionList.push(extractorSession);
      extractorSession.catch(this.extractorScheduler.flush);
      extractorSession.then(this.extractorScheduler.flush);
      this.extractorScheduler.schedule(extractorSession);
    }

    return Promise.all(extractorSessionList)
      .catch(callback)
      .then(() => callback())
    ;
  }

  onUrlListDuplexStreamEnd() {
    this.emit('session.end');
  }
}

module.exports = CrawlerManagerSession;
