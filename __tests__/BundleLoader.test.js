/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const BundleLoader = require('../BundleLoader');
const ExampleJobExtractor = require('../__fixtures__/bundles/example.com/Job');
const ExampleJobListExtractor = require('../__fixtures__/bundles/example.com/JobList');
const test = require('lookly-preset-ava/test');

test('loads example bundle', t => {
  const bundleLoader = new BundleLoader('../__fixtures__/bundles/example.com');

  return bundleLoader
    .loadBundle()
    .then(bundle => {
      t.deepEqual(bundle.extractorList, [
        ExampleJobExtractor,
        ExampleJobListExtractor,
      ]);
      t.is(bundle.jobExpiredExtractor, null);
      t.is(bundle.jobExtractor, ExampleJobExtractor);
      t.is(bundle.jobListExtractor, ExampleJobListExtractor);
      t.is(bundle.name, 'example.com');
    })
  ;
});
