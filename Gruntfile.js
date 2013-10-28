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

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bg-shell');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['browserify:basic']);
  grunt.registerTask('dev', ['watch']);
  grunt.registerTask('benchmark', ['browserify:benchmark']);
  grunt.registerTask('lint', ['jshint']);
};


