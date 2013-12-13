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
        }, vars),
        transform: ['varify']
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
        "!client/emscrypt.js",
        "!web/**"
      ],
      options: {
        jshintrc: ".jshintrc"
      }
    },
    copyright: {
      files: [
        "**/*.js",
        "!**/node_modules/**"
      ],
      options: {
        pattern: "This Source Code Form is subject to the terms of the Mozilla Public"
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerMultiTask('copyright', 'Copyright all the things!', function () {
    var pattern = this.options().pattern;
    var files = this.filesSrc.map(function (file) {
      return {
        "name": file,
        "txt": grunt.file.read(file, "utf8")
      };
    }).filter(function (file) {
      return !file.txt.match(pattern);
    });

    if (files.length) {
      grunt.log.subhead("The following files are missing copyright headers:");
      files.forEach(function (file) {
        grunt.log.warn(file.name);
      });
      return false;
    }
  });

  grunt.registerTask('default', ['browserify:basic']);
  grunt.registerTask('dev', ['watch']);
  grunt.registerTask('benchmark', ['browserify:benchmark']);
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('qa', ['copyright', 'jshint']);
};
