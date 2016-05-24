/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const eslint = require('space-preconfigured-eslint');
const gulp = require('gulp');
const mocha = require('space-preconfigured-mocha');

gulp.task('lint', function () {
  return eslint([
    __filename,
    './src/**/*.js',
  ]);
});

gulp.task('test', function () {
  return mocha([
    './src/__tests__/**/*.test.js',
  ]);
});
