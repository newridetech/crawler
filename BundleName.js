/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const path = require('path');

const BUNDLE_DIRECTORY_NAME = 'bundles';

class BundleName {
  static fromDirectoryName(directoryName) {
    const pathChunkList = directoryName.split(path.sep);
    const bundlesIndex = pathChunkList.indexOf(BUNDLE_DIRECTORY_NAME);
    const bundleName = pathChunkList.slice(bundlesIndex)[1];

    return new BundleName(bundleName);
  }

  constructor(bundleName) {
    this.bundleName = bundleName;
  }

  toString() {
    return this.bundleName;
  }
}

module.exports = BundleName;
