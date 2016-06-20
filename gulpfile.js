/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const ava = require('lookly-preset-ava');
const eslint = require('lookly-preset-eslint');
const gulp = require('gulp');

gulp.task('lint', () => (
  eslint([
    __filename,
    './src/**/*.js',
  ])
));

gulp.task('test', ['lint'], () => (
  ava([
    './src/__tests__/**/*.test.js',
  ])
));
