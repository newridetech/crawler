/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const Duplex = require('stream').Duplex;
const isEmpty = require('lodash/isEmpty');
const mobx = require('mobx');
const Promise = require('bluebird');

class UrlListDuplexStream extends Duplex {
  constructor(urlList = []) {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
    });

    this.buffer = mobx.observable([]);
    this.feed(urlList);
  }

  end() {
    this.push(null);
  }

  feed(urlList) {
    return Promise.all(urlList.map(url => (
      Promise.fromCallback(cb => this.write(url, cb))
    )));
  }

  flush(size) {
    let pushed = 0;

    for (; pushed < size && !isEmpty(this.buffer); pushed += 1) {
      if (!this.push(this.buffer.shift())) {
        return false;
      }
    }

    return pushed;
  }

  _read(size) {
    let pushed = this.flush(size);

    if (pushed === false) {
      return;
    }

    let left = size - pushed;

    const dispose = mobx.observe(this.buffer, change => {
      if (change.addedCount) {
        pushed = this.flush(left);
        left -= pushed;
        if (pushed === false || left <= 0) {
          dispose();
        }
      }
    });
  }

  _write(chunk, encoding, callback) {
    this.buffer.push(chunk.toString('utf8'));
    callback();
  }
}

module.exports = UrlListDuplexStream;
