// Generated on 2016-03-13 using generator-angular 0.15.1
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var openURL = require('open');
var lazypipe = require('lazypipe');
var rimraf = require('rimraf');
var wiredep = require('wiredep').stream;
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var process = require('child_process');
var exec = require('child_process').exec;
var reload = browserSync.reload;

var yeoman = {
  app: require('./bower.json').appPath || 'app',
  dist: 'dist'
};
var paths = {
  scripts: [yeoman.app + '/scripts/**/*.js'],
  styles: [yeoman.app + '/styles/**/*.scss'],
  views: {
    main: yeoman.app + '/index.html',
    files: [yeoman.app + '/views/**/*.html']
  }
};

var runGAE = function(yaml) {
  console.info('Starting flask server');
  var spawn = process.spawn;
  var PIPE = {stdio: 'inherit'};
  spawn('dev_appserver.py', [yaml,'--port', '3000'], PIPE);
};
////////////////////////
// Reusable pipelines //
////////////////////////

var lintScripts = lazypipe()
  .pipe($.jshint, '.jshintrc')
  .pipe($.jshint.reporter, 'jshint-stylish');

var styles = lazypipe()
  .pipe($.sass, {
    outputStyle: 'expanded',
    precision: 10
  })
  .pipe($.autoprefixer, 'last 1 version')
  .pipe(gulp.dest, '.tmp/styles');

///////////
// Tasks //
///////////

gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe(styles());
});

gulp.task('lint:scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(lintScripts());
});

gulp.task('gae:dev', function() {
  runGAE('devapp.yaml')
});

gulp.task('gae:prod', function() {
  runGAE('app.yaml')
});

gulp.task('watch', function () {
  $.watch(paths.styles)
    .pipe($.plumber())
    .pipe(styles());

  $.watch(paths.scripts)
    .pipe($.plumber())
    .pipe(lintScripts());

  gulp.watch('bower.json', ['bower']);
});

gulp.task('start:server:dev', ['gae:dev'], function() {
  browserSync({
    notify: false,
    port:9000,
    proxy: 'http://localhost:3000'
  });

  gulp.watch(paths.scripts, reload);
  gulp.watch([paths.views.files], reload);
  gulp.watch([paths.views.main], reload);
});

gulp.task('serve', function (cb) {
  runSequence(
    ['start:server:dev'],
    ['lint:scripts'],
    'watch', cb);
});

gulp.task('start:server:prod', ['build','gae:prod'], function() {
  browserSync({
    notify: false,
    port:9000,
    proxy: 'http://localhost:3000'
  });

  gulp.watch([yeoman.dist + '/**'], [reload]);
});

gulp.task('serve:prod', function (cb) {
  runSequence(['build'],
    ['start:server:prod'], cb);
});


// inject bower components
gulp.task('bower', function () {
  return gulp.src(paths.views.main)
    .pipe(wiredep({
      directory: 'bower_components',
      ignorePath: '..'
    }))
  .pipe(gulp.dest(yeoman.app));
});

///////////
// Build //
///////////

gulp.task('clean:dist', function (cb) {
  rimraf('./dist', cb);
});

gulp.task('client:build', ['html', 'styles'], function () {
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var notIndexFilter = $.filter(['**/*', '!**/index.html']);

  return gulp.src(paths.views.main)
    .pipe($.useref({searchPath: yeoman.app}))
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.minifyCss({cache: true}))
    .pipe(cssFilter.restore())
    .pipe(notIndexFilter)
    .pipe($.rev())
    .pipe(notIndexFilter.restore())
    .pipe($.revReplace())
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('html', function () {
  return gulp.src(yeoman.app + '/views/**/*')
    .pipe(gulp.dest(yeoman.dist + '/views'));
});

gulp.task('images', function () {
  return gulp.src(yeoman.app + '/images/**/*')
    .pipe($.cache($.imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest(yeoman.dist + '/images'));
});

gulp.task('copy:extras', function () {
  return gulp.src(yeoman.app + '/*/.*', { dot: true })
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('build', ['clean:dist'], function () {
  runSequence(['copy:extras', 'client:build']);
});

gulp.task('default', ['build']);
