/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const EventEmitter = require('events');

class DataBus extends EventEmitter {
  pushData(name, data) {
    return new Promise((resolve, reject) => this.emit(name, {
      data,
      reject,
      resolve,
    }));
  }
}

module.exports = DataBus;
