/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const BundleListLoader = require('../BundleListLoader');
const ExampleJobExtractor = require('../__fixtures__/bundles/example.com/Job');
const ExampleJobListExtractor = require('../__fixtures__/bundles/example.com/JobList');
const path = require('path');
const test = require('lookly-preset-ava/test');

test('loads example bundle', t => {
  const bundleListLoader = new BundleListLoader([
    path.join(__dirname, '../__fixtures__/bundles/example.com'),
  ]);

  return bundleListLoader
    .loadBundleList()
    .then(bundleList => {
      t.is(bundleList.bundleList[0].jobExpiredExtractor, null);
      t.is(bundleList.bundleList[0].jobExtractor, ExampleJobExtractor);
      t.is(bundleList.bundleList[0].jobListExtractor, ExampleJobListExtractor);
      t.is(bundleList.bundleList[0].name, 'example.com');
      t.deepEqual(bundleList.extractorList, [
        ExampleJobExtractor,
        ExampleJobListExtractor,
      ]);
      t.deepEqual(bundleList.jobListEntryUrlList, [
        'http://example.com',
      ]);
    })
  ;
});
