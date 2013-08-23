var fs = require('fs');
var path = require('path');
var vars = require('insert-module-globals').vars;

function mergeVars (opts, defaults) {
  if (!opts) return defaults;
  Object.keys(defaults).map(function (key) {
    if (!opts[key]) opts[key] = defaults[key];
  });
  return opts;
}

module.exports = function (grunt) {

  grunt.initConfig({
    browserify: {
      basic: {
        src: ['entry.js'],
        dest: 'web/bundle.js',
        options: {
          alias: [
            'browser-request:request',
            'crypto-browserify:crypto',
            'bigint-browserify:bignum',
            'buffer-browserify:buffer',
          ],
          ignore: [
            'dns',
            'hapi',
            'node-scrypt-js',
            '../error',
          ],
          insertGlobalVars: mergeVars({
            Buffer: function() {
              return {
                id: path.join(__dirname, 'lib', 'buffer_shim.js'),
                source: fs.readFileSync('lib/buffer_shim.js', 'utf8'),
                suffix: '.Buffer'
              };
            }
          }, vars),
          standalone: 'gherkin'
        }
      }
    },
    watch: {
      src: {
        options: {
          atBegin: true
        },
        files: ['lib/**/*.js', 'routes/**/*.js'],
        tasks: ['default'],
      },
      test: {
        files: ['test/**/*'],
        tasks: ['bgShell:test']
      }
    },
    bgShell: {
      test: {
        cmd: 'npm test',
        bg: false
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bg-shell');

  grunt.registerTask('default', ['browserify']);
  grunt.registerTask('dev', ['watch']);
};


