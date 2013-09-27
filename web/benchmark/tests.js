var suite = new Benchmark.Suite;
var Buffer = gherkin.Buffer;

suite

  .add('pbkdf22Create#test', function (deferred) {

    var p = gherkin.pbkdf2.derive(
      Buffer("pässwörd"),
      Buffer('identity.mozilla.com/picl/v1/first-PBKDF:andré@example.org')
    )

    p.done(function () {
      deferred.resolve();
      console.log('Done!')
    })
  }, { 'defer': true })

  .add('gherkin.keyStretch#test', function (deferred) {

    var email = Buffer('andré@example.org');
    var password = Buffer('pässwörd');
    var saltHex = '00f000000000000000000000000000000000000000000000000000000000034d';

    var p = gherkin.keyStretch.derive(email, password, saltHex)

    p.done(function (stretchedPassword) {
      console.log('Done!')
      deferred.resolve();
    })

  }, { 'defer': true })

  .on('cycle', function (event) {
    console.log(String(event.target));
    document.getElementById('result').innerHTML += String(event.target) + '<hr/>';
  })

  .on('complete', function () {
    document.getElementById('result').innerHTML += 'Done!';
  })

  .run();
