var gherkinLib = require('./gherkin');
var codes = require('./lib/error_codes');

module.exports = {
  Client: gherkinLib,
  errorCodes: codes
};

gherkin = module.exports
