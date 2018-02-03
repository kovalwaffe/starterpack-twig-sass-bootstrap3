const gulp = require('gulp');
const sass = require('gulp-sass');
const notify = require('gulp-notify');
const browserSync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
// optimization of image files (https://tinypng.com/)
// tinypng = require('gulp-tinypng'),
// Developer Api Key - https://tinypng.com/
// tinyApiKey = '',
const twig = require('gulp-twig');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const rimraf = require('rimraf');
const htmlbeautify = require('gulp-html-beautify');
const cache = require('gulp-cache');
const util = require('gulp-util');

const config = {
  js: [
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js',
    'src/js/scripts.js',
  ],
  prod: !!util.env.prod,
};

gulp.task('browserSync', () => {
  browserSync({
    server: {
      baseDir: 'dist',
    },
  });
});

gulp.task('clean', () => {
  rimraf.sync('dist');
});

require('events').EventEmitter.defaultMaxListeners = 0;

gulp.task('images', () => {
  gulp.src('src/images/**/*.{jpg,png,gif}')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'));
});
// optimization 'tinypng'
/*
 gulp.task('image', () =>
 gulp.src('src/img/*')
 .pipe(tinypng(tinyApiKey))
 .pipe(gulp.dest('app/img'))
 );
 */
gulp.task('sass', () => gulp.src('src/sass/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({
    outputStyle: 'compressed',
  }))
  .on('error', notify.onError(error => `Error: ${error.message}`))
  .pipe(autoprefixer({
    browsers: ['last 3 versions', 'ie >= 9', 'android >= 2.3.3', 'iOS >= 6'],
  }))
  .pipe(rename({
    suffix: '.min',
  }))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('dist/css'))
  .pipe(browserSync.reload({
    stream: true,
  })));

gulp.task('scripts', () => gulp.src(config.js)
  .pipe(sourcemaps.init())
  .pipe(concat('scripts.min.js'))
  .pipe(config.prod ? uglify() : util.noop())
  .on('error', notify.onError(error => `Error: ${error.message}`))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('dist/js'))
  .pipe(browserSync.reload({
    stream: true,
  })));

gulp.task('views', () => gulp.src('src/views/pages/*.twig')
  .pipe(twig())
  .pipe(htmlbeautify())
  .on('error', notify.onError(error => `Error: ${error.message}`))
  .pipe(gulp.dest('dist'))
  .on('end', () => {
    browserSync.reload();
  }));

gulp.task('fonts', () => gulp.src('src/fonts/**/*.*')
  .pipe(gulp.dest('dist/fonts')));

gulp.task('build', ['clean', 'sass', 'fonts', 'scripts', 'images', 'views']);

gulp.task('default', ['build', 'browserSync'], () => {
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['scripts']);
  gulp.watch('src/images/**/*.{jpg,png,gif}', ['images']);
  gulp.watch('src/views/**/*.twig', ['views']);
});
