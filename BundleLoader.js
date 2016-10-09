/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

/* eslint-disable global-require */

const BundleName = require('./BundleName');
const filter = require('lodash/filter');
const path = require('path');
const resolve = require('resolve');

const JOB_EXPIRED_EXTRACTOR_FILE_NAME = 'JobExpired';
const JOB_EXTRACTOR_FILE_NAME = 'Job';
const JOB_LIST_EXTRACTOR_FILE_NAME = 'JobList';

function doResolve(self, directoryName, fileName) {
  const moduleName = path.resolve(directoryName, fileName);

  return new Promise(resolvePromise => (
    resolve(moduleName, (err, res) => {
      if (err) {
        resolvePromise(null);
      } else {
        resolvePromise(require(res));
      }
    })
  ));
}

class BundleLoader {
  constructor(directoryName) {
    this.directoryName = directoryName;
  }

  loadBundle() {
    return Promise.all([
      this.loadJobExpiredExtractor(this.directoryName),
      this.loadJobExtractor(this.directoryName),
      this.loadJobListExtractor(this.directoryName),
      this.loadBundleName(this.directoryName),
    ]).then(results => ({
      extractorList: filter([
        results[0],
        results[1],
        results[2],
      ]),
      jobExpiredExtractor: results[0],
      jobExtractor: results[1],
      jobListExtractor: results[2],
      name: results[3],
    }));
  }

  loadBundleName(directoryName) {
    return BundleName.fromDirectoryName(directoryName).toString();
  }

  loadJobExpiredExtractor(directoryName) {
    return doResolve(this, directoryName, JOB_EXPIRED_EXTRACTOR_FILE_NAME);
  }

  loadJobExtractor(directoryName) {
    return doResolve(this, directoryName, JOB_EXTRACTOR_FILE_NAME);
  }

  loadJobListExtractor(directoryName) {
    return doResolve(this, directoryName, JOB_LIST_EXTRACTOR_FILE_NAME);
  }
}

module.exports = BundleLoader;
