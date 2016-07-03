var gulp = require('gulp');
var path = require('path');
var conf = require('./conf');
var ngConstant = require('gulp-ng-constant');
var rename = require('gulp-rename');
var replace = require('gulp-replace');

var taskConfig = function (config) {
  return ngConstant(config)
    .pipe(replace('\n;', ';\nexport let name: string = "KS.config";'))
    .pipe(rename('config.ts'))
    .pipe(gulp.dest(path.join(conf.paths.src, '/app/')));
};

gulp.task('config:e2e', function () {
  var config = require(path.join('../', conf.paths.src, '/config.json')).e2e;
  return taskConfig(config);
});

gulp.task('config', function () {
  var config = require(path.join('../', conf.paths.src, '/config.json')).dev;
  return taskConfig(config);
});

gulp.task('config:test', function () {
  var config = require(path.join('../', conf.paths.src, '/config.json')).test;
  return taskConfig(config);
});

gulp.task('config:build', function () {
  var config = require(path.join('../', conf.paths.src, '/config.json')).build;
  return ngConstant(config)
    .pipe(rename('config.ts'))
    .pipe(gulp.dest(path.join(conf.paths.src, '/app/')));
});

