'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var files = {
    css: ['./public/css/*.css'],
    main: ['./public/js/main.js']
};

gulp.task('js', function() {  
  return browserify(files.main[0])
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    //.pipe(uglify())
    .pipe(gulp.dest('./public'));
});

gulp.task('default', () => { return gulp.watch(files.main,       ['js'])  });