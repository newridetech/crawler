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
  extractFromUrl(extractorSession, url) {
    new Nightmare()
      .goto(url)
      .wait('#main')
      .evaluate(function () {
        return document.querySelector('#main').textContent;
      })
      .then(textContent => {
        extractorSession.pushData('main_text_content', { textContent });
      })
      .then(extractorSession.done)
      .catch(extractorSession.fail)
    ;
  }
}

module.exports = ExampleMainTextContent;
