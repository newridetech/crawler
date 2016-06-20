/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const Extractor = require('../Extractor');
const ExtractorToHostSet = require('../ExtractorToHostSet');
const test = require('lookly-preset-ava/test');

test('should match given urls', t => {
  const extractor1 = new Extractor();
  const extractor2 = new Extractor();
  const extractor3 = new Extractor();
  const extractors = new ExtractorToHostSet([
    {
      hostExtractor: extractor1,
      hostPattern: /foo.example.com/,
    },
    {
      hostExtractor: extractor2,
      hostPattern: /bar.example.com/,
    },
    {
      hostExtractor: extractor3,
      hostPattern: /bar.example.com\/index.html/,
    },
  ]);
  const foundExtractors = extractors.findExtractorListForUrl('bar.example.com/index.html');

  t.true(foundExtractors.includes(extractor2));
  t.true(foundExtractors.includes(extractor3));
  t.is(foundExtractors.length, 2);
});
