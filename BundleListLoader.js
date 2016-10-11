/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const BundleLoader = require('./BundleLoader');

function reduceExtracotrList(acc, bundle) {
  return acc.concat(bundle.extractorList);
}

function reduceJobListEntryUrlList(acc, bundle) {
  return acc.concat(bundle.jobListEntryUrl);
}

class BundleListLoader {
  constructor(directoryNameList) {
    this.directoryNameList = directoryNameList;
  }

  loadBundleList() {
    const promiseList = this.directoryNameList.map(directoryName => (
      new BundleLoader(directoryName).loadBundle()
    ));

    return Promise.all(promiseList).then(bundleList => ({
      bundleList,
      extractorList: bundleList.reduce(reduceExtracotrList, []),
      jobListEntryUrlList: bundleList.reduce(reduceJobListEntryUrlList, []),
    }));
  }
}

module.exports = BundleListLoader;
