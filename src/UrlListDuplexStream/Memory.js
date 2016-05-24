/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const isEmpty = require('lodash/isEmpty');
const mobx = require('mobx');
const UrlListDuplexStream = require('../UrlListDuplexStream');

class Memory extends UrlListDuplexStream {
  constructor() {
    super();

    this.buffer = mobx.observable([]);
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

module.exports = Memory;
