/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const BundleName = require('../BundleName');
const test = require('lookly-preset-ava/test');

test('extracts bundle name', t => {
  const bundleName = BundleName.fromDirectoryName('../__fixtures__/bundles/example.com');

  t.is(bundleName.toString(), 'example.com');
});

test('extracts bundle name from nested directory', t => {
  const bundleName = BundleName.fromDirectoryName('../__fixtures__/bundles/example.com/foo/bar');

  t.is(bundleName.toString(), 'example.com');
});
