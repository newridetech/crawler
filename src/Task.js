/**
 * Copyright (c) 2016-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

class Task extends Promise {
  constructor() {
    let myResolve;
    let myReject;

    super((resolve, reject) => {
      myResolve = resolve;
      myReject = reject;
    });

    this.resolve = myResolve.bind(this);
    this.reject = myReject.bind(this);
  }
}

module.exports = Task;
