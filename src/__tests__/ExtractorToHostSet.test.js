/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

/* global after: false, before: false, describe: false, it: false */

const assert = require('chai').assert;
const Extractor = require('../Extractor');
const ExtractorToHostSet = require('../ExtractorToHostSet');

describe('ExtractorToHostSet', function () {
  describe('#findExtractorListForUrl', function () {
    it('should match given urls', function () {
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

      assert.include(foundExtractors, extractor2);
      assert.include(foundExtractors, extractor3);
      assert.lengthOf(foundExtractors, 2);
    });
  });
});
