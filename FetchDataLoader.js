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
  fetch(url, options = {}) {
    return new Promise((resolve, reject) => {
      request(Object.assign({
        url,
      }, options), (err, response, body) => {
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
