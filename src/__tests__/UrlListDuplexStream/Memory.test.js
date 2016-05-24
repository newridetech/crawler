/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

/* eslint new-cap: 0 */
/* global after: false, before: false, describe: false, it: false */

const assert = require('chai').assert;
const MemoryUrlListDuplexStream = require('../../UrlListDuplexStream/Memory');

describe('UrlListDuplexStream/Memory', function () {
  it('should listen to the incoming data', function (done) {
    const urlListDuplexStream = new MemoryUrlListDuplexStream();
    const dataList = [];

    urlListDuplexStream.write('hello');

    urlListDuplexStream
      .on('data', data => {
        dataList.push(data);
        if (dataList.length === 2) {
          assert.deepEqual(dataList, ['hello', 'world']);
          urlListDuplexStream.end();
        }
      })
      .on('end', done)
    ;

    setTimeout(() => urlListDuplexStream.write('world'));
  });
});
