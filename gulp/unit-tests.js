'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var karma = require('karma');

var pathSrcHtml = [
  path.join(conf.paths.src, '/**/*.html')
];

var pathSrcJs = [
  path.join(conf.paths.tmp, '/serve/app/index.module.js')
];

function runTests (singleRun, done) {
  var reporters = ['progress'];
  var preprocessors = {};

  pathSrcHtml.forEach(function(path) {
    preprocessors[path] = ['ng-html2js'];
  });

  if (singleRun) {
    pathSrcJs.forEach(function(path) {
      preprocessors[path] = ['coverage'];
    });
    reporters.push('coverage')
  }

  var localConfig = {
    configFile: path.join(__dirname, '/../karma.conf.js'),
    singleRun: singleRun,
    autoWatch: !singleRun,
    reporters: reporters,
    preprocessors: preprocessors
  };

  var server = new karma.Server(localConfig, function(failCount) {
    done(failCount ? new Error("Failed " + failCount + " tests.") : null);
  });

  server.start();
}

function benchMarks(singleRun, done) {
  var reporters = ['benchmark'];
  var preprocessors = {};

  pathSrcHtml.forEach(function(path) {
    preprocessors[path] = ['ng-html2js'];
  });

  var localConfig = {
    configFile: path.join(__dirname, '/../karma.bench.conf.js'),
    singleRun: singleRun,
    autoWatch: !singleRun,
    reporters: reporters,
    preprocessors: preprocessors
  };

  var server = new karma.Server(localConfig, function(failCount) {
    done(failCount ? new Error("Failed " + failCount + " tests.") : null);
  });

  server.start();
}

gulp.task('test', ['config:test', 'scripts:test'], function(done) {
  runTests(true, done);
});

gulp.task('test:auto', ['config:test', 'scripts:test-watch'], function(done) {
  runTests(false, done);
});

gulp.task('bench', ['config:test', 'scripts:bench'], function(done) {
  benchMarks(true, done);
});

gulp.task('bench:auto', ['config:test', 'scripts:bench-watch'], function(done) {
  benchMarks(false, done);
});


