/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const Duplex = require('stream').Duplex;
const Promise = require('bluebird');

class UrlListDuplexStream extends Duplex {
  constructor() {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
    });
  }

  end() {
    this.push(null);
  }

  feed(urlList) {
    return Promise.all(urlList.map(url => (
      Promise.fromCallback(cb => this.write(url, cb))
    )));
  }
}

module.exports = UrlListDuplexStream;
