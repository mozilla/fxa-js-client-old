/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var gherkinLib = require('./gherkin');
var codes = require('./lib/error_codes');

module.exports = {
  Client: gherkinLib,
  errorCodes: codes
};

gherkin = module.exports
