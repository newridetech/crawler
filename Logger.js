/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

class Logger {
  error(err) {
    console.error(err);

    return Promise.resolve();
  }

  errorAndRethrow(err) {
    return this
      .error(err)
      .then(() => {
        throw err;
      })
    ;
  }

  log(log) {
    console.log(log);

    return Promise.resolve();
  }

  info(info) {
    console.info(info);

    return Promise.resolve();
  }
}

module.exports = Logger;
