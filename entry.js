var gherkinLib = require('./gherkin');
var codes = require('./lib/error_codes');

module.exports = {
  Client: gherkinLib,
  errorCodes: codes
};

gherkin = module.exports

if (typeof console === "undefined") {
  var noop = function () {};
  console = {
    log: noop,
    warn: noop,
    error: noop,
    assert: noop,
    trace: noop
  };
}

if (typeof location === "undefined") {
  location = {};
}
