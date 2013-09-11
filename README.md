Gherkin
========

Client library for Profile In the CLoud (PICL)

Forked from the original [PICL IdP](https://github.com/mozilla/picl-idp)

## Build
First run `npm install` then `npm install -g grunt-cli`.
To build gherkin for the web, run `grunt` and it will generate a new bundled script in `web/bundle.js`.

## Benchmarks
Run `grunt benchmark` to generate the benchmark bundle in `web/benchmark-bundle.js`. Open `web/benchmark.html` in a browser to see performance results.
The results page will print "Done!" when all tests have finished.

## Use
gherkin works in both node.js and in web browsers.`web/example.html` shows an example of how to use the client:

```
<script src="bundle.js"></script>
<script>

var Client = gherkin.Client;
var email = 'mailv@example.com';
var password = 'verySecurePassword';

var publicKey = {
  "algorithm":"RS",
  "n":"4759385967235610503571494339196749614544606692567785790953934768202714280652973091341316862993582789079872007974809511698859885077002492642203267408776123",
  "e":"65537"
};

var client = null;

create(email, password, publicKey);

function create (email, password, publicKey) {
  var duration = 1000 * 60 * 60 * 24;

  Client.create('http://127.0.0.1:9000', email, password)
    .then(
      function (x) {
        console.log('time to get keys!!');
        client = x;
        return client.keys();
      }
    )
    .then(
      function (keys) {
        console.log('my keys:', keys);
      }
    )
    .then(
      function () {
        return client.sign(publicKey, duration);
      }
    )
    .then(
      function (cert) {
        console.log('my cert:', cert);
        return 'done';
      }
    )
    .done(console.log, console.error);

}

</script>
```
## License

MPL 2.0
