/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const ExampleMainTextContentExtractor = require('../Extractor/ExampleMainTextContent');
const Extractor = require('../Extractor');
const ExtractorSet = require('../ExtractorSet');
const test = require('lookly-preset-ava/test');

test('should match given urls', t => {
  const extractor1 = new Extractor();
  const extractor2 = new ExampleMainTextContentExtractor();
  const extractor3 = new ExampleMainTextContentExtractor();
  const extractors = new ExtractorSet([
    extractor1,
    extractor2,
    extractor3,
  ]);

  return extractors.findExtractorListForUrl('localhost:1234/index.html')
    .then(foundExtractors => {
      t.true(foundExtractors.includes(extractor2));
      t.true(foundExtractors.includes(extractor3));
      t.is(foundExtractors.length, 2);
    })
  ;
});
