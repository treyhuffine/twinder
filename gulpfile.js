var gulp  = require('gulp');
var concat = require('gulp-concat');

gulp.task('js', function(cb) {
  gulp.src('./source/javascripts/**/*.js')
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./public/javascripts'));
});
