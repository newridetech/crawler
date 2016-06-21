/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const test = require('lookly-preset-ava/test');
const UrlListDuplexStream = require('../UrlListDuplexStream');

test.cb('should listen to the incoming data', t => {
  const urlListDuplexStream = new UrlListDuplexStream();
  const dataList = [];

  urlListDuplexStream.write('hello');

  urlListDuplexStream
    .on('data', data => {
      dataList.push(data);
      if (dataList.length === 2) {
        t.deepEqual(dataList, ['hello', 'world']);
        urlListDuplexStream.end();
      }
    })
    .on('end', t.end)
  ;

  urlListDuplexStream.write('world');
});
