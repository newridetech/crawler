/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const Extractor = require('../Extractor');
const Nightmare = require('nightmare');

class ExampleMainTextContent extends Extractor {
  extractFromUrl(url) {
    return new Nightmare()
      .goto(url)
      .wait('#main')
      .evaluate(() => document.querySelector('#main').textContent)
      .then(textContent => {
        console.log(textContent);
      })
    ;
  }
}

module.exports = ExampleMainTextContent;
