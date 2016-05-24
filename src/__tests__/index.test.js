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
const httpServer = require('http-server');
const Nightmare = require('nightmare');
const path = require('path');

describe('test yahoo search results', function () {
  let server;

  after(function (done) {
    server.server.close(done);
  });

  before(function (done) {
    server = httpServer.createServer({
      root: path.resolve(__dirname, '..', '__fixtures__'),
    });

    server.listen(done);
  });

  it('should find the nightmare github link first', function () {
    return Nightmare()
      .goto(`http://localhost:${server.server.address().port}`)
      .wait('#main')
      .evaluate(function () {
        return document.querySelector('#main').textContent;
      })
      .end()
      .then(function (textContent) {
        assert.strictEqual(textContent, 'Hello!');
      });
  });
});
