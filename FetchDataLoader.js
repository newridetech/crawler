/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const request = require('request');

class FetchDataLoader {
  fetch(url) {
    return new Promise((resolve, reject) => {
      request(url, (err, response, body) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            status: response.statusCode,
            text: body,
          });
        }
      });
    });
  }
}

module.exports = FetchDataLoader;
