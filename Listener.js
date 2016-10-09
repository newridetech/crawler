/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

class Listener {
  handleDatagram(datagram) {
    return this.handleData(datagram.data)
      .then(datagram.resolve)
      .catch(datagram.reject)
    ;
  }
}

module.exports = Listener;
