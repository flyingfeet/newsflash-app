var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var mainbowerfiles = require('main-bower-files');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
  .pipe(sass())
  .pipe(gulp.dest('./www/css/'))
  .pipe(minifyCss({
    keepSpecialComments: 0
  }))
  .pipe(rename({ extname: '.min.css' }))
  .pipe(gulp.dest('./www/css/'))
  .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
  .on('log', function(data) {
    gutil.log('bower', gutil.colors.cyan(data.id), data.message);
  });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
      );
    process.exit(1);
  }
  done();
});

gulp.task('bower-js', function () {
  var files = mainbowerfiles( { debugging: false, checkExistence: true, filter: function(filePath) { return getFileByExtension(filePath, 'js'); } } );
  gutil.log('Processing', gutil.colors.cyan(files.length), 'bower js files');

  return gulp.src(
    files,
    { base: './www/lib/' }
    )
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest('www/js/'));
});

gulp.task('bower-css', function () {
  var files = mainbowerfiles( { debugging: false, checkExistence: true, filter: function(filePath) { return getFileByExtension(filePath, 'css'); } } );
  gutil.log('Processing', gutil.colors.cyan(files.length), 'bower css files');

  return gulp.src(
    files,
    { base: './www/lib/' }
    )
  .pipe(concat('vendor.css'))
  .pipe(gulp.dest('www/css/'));
});

gulp.task('bower', ['bower-js', 'bower-css']);

function getFileByExtension(filePath, extension) {
  var ext = filePath.substr(filePath.lastIndexOf('.') + 1);

  if(ext == extension) {
    return filePath;
  }
};
