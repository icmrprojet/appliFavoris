var gulp = require('gulp');
const sass = require("gulp-sass")
const watchSass = require("gulp-watch-sass")
let cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
var runSequence = require('run-sequence');
var sassbeautify = require('gulp-sassbeautify');
var server = require('gulp-server-livereload');

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(server({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});

gulp.task('default', function() {
  runSequence('sass','autoprefixer','minify-css')
});


gulp.task("sass", () => gulp.src([
  "./css/**/*.scss",
  "!./css/libs/**/*"
])
  .pipe(sass())
  .pipe(gulp.dest("./css")));
 
gulp.task("sass:watch", () => {
  gulp.watch([
    "./css/**/*.scss",
    "!./css/libs/**/*"
  ], ["sass"]);
});

gulp.task('minify-css', () => {
  return gulp.src('css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('css/min'));
});

gulp.task('autoprefixer', () =>
    gulp.src('css/main.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('css'))
);

gulp.task('beautify-scss', function () {
  gulp.src('css/**/*.scss')
    .pipe(sassbeautify())
    .pipe(gulp.dest('css'))
})