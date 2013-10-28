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
          'domain',
          'node-scrypt-js',
        ],
        insertGlobalVars: mergeVars({
          Buffer: function() {
            return {
              id: path.join(__dirname, 'lib', 'buffer_shim.js'),
              source: fs.readFileSync('lib/buffer_shim.js', 'utf8'),
              suffix: '.Buffer'
            };
          }
        }, vars)
      },
      basic: {
        src: ['entry.js'],
        dest: 'web/bundle.js'

      },
      benchmark: {
        src: ['benchmark.js'],
        dest: 'web/benchmark-bundle.js'
      },
      test: {
        options: {
          transform: [ 'requireify']
        },
        src: ['test.js'],
        dest: 'test/test-bundle.js'
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
    },
    uglify: {
      my_target: {
        files: {
          'web/bundle.min.js': ['web/bundle.js']
        }
      }
    },
    jshint: {
      files: [
        "**/*.js",
        "**/*.json",
        "!node_modules/**",
        "!web/**"
      ],
      options: {
        jshintrc: ".jshintrc"
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['browserify:basic']);
  grunt.registerTask('dev', ['watch']);
  grunt.registerTask('benchmark', ['browserify:benchmark']);
  grunt.registerTask('lint', ['jshint']);
};


