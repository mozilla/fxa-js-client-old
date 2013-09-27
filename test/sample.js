const BUNDLE_PATH = "./web/benchmark-bundle.js";
//var dump = require("utils").dump;

phantom.injectJs(BUNDLE_PATH);

var keys = Object.keys(gherkin);
console.log(keys)
Buffer = gherkin.Buffer;
P = gherkin.P
pdbkdf2 = gherkin.pdbkdf2

  var salt = Buffer('identity.mozilla.com/picl/v1/first-PBKDF:andré@example.org')
  var password = Buffer('pässwörd')
 	function end() { slimer.exit(); }

 	try {
  pdbkdf2.derive(password, salt)
    .then(
    function (K1) {
    	console.log('Test this value: \n')
    	console.log(K1)
    
    },
    function (err) {
    	console.log(err)
    }
  )
  .done(end, end)

	} catch (e) {
		console.log(e)
	}
