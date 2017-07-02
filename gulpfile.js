const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('transpile-module', () => {
  return gulp.src(['./src/index.js'])
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('transpile-classes', () => {
  return gulp.src(['./src/classes/*.js'])
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(gulp.dest('./dist/classes/'));
});

gulp.task('babel-module', () => {
  return gulp.watch(['./src/index.js'], ['transpile-module']);
});

gulp.task('babel-classes', () => {
  return gulp.watch(['./src/classes/*.js'], ['transpile-classes']);
});

gulp.task('default', [
  'transpile-module',
  'transpile-classes',
  'babel-module',
  'babel-classes'
]);
