import gulp from 'gulp';
import sass from 'gulp-sass';
import { onError } from 'gulp-notify';
import browserSync, { reload } from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';
import postcss from 'gulp-postcss';
// import rename from 'gulp-rename';
// import uglify from 'gulp-uglify';
// optimization of image files (https://tinypng.com/)
// tinypng = require('gulp-tinypng'),
// Developer Api Key - https://tinypng.com/
// tinyApiKey = '',
// import twig from 'gulp-twig';
// import concat from 'gulp-concat';
// import imagemin from 'gulp-imagemin';
// import { init, write } from 'gulp-sourcemaps';
// import { sync } from 'rimraf';
// import htmlbeautify from 'gulp-html-beautify';
// import cache from 'gulp-cache';
// import { env, noop } from 'gulp-util';
// const production = !!util.env.production;

const config = {
  js: [
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js',
    'src/js/scripts.js'
  ],
  prod: !!util.env.prod
};

const sassPaths = {
  src: "src/sass/**/*.scss",
  dest: "dist/css/"
};

// Tasks Begin
gulp.task("sass", () => {
  return sass(`${sassPths.src}`, {
    sourcemap: true, style: "expanded"
  })
  .pipe(gulp.dest(`${sassPaths.dest}`))
  .pipe($.size({
    pretty: true,
    title: "SASS"
  }));
});

gulp.task("processCSS", [sass], () => {
  // What processors/plugins to use with PostCSS
  const PROCESSORS = [
    autoprefixer({browsers: ["last 3 versions"]})
  ];
  return gulp
    .src("src/css/**/*.css")
    .pipe($.sourcemaps.init())
    .pipe(postcss(PROCESSORS))
    .pipe($.sourcemaps.write("."))
    .pipe(gulp.dest("site/static/css"))
    .pipe(
      $.size({
        pretty: true,
        title: "processCSS"
      })
    );
});










// gulp.task('browserSync', () => {
//   browserSync({
//     server: {
//       baseDir: 'dist'
//     }
//   });
// });

// gulp.task('clean', () => {
//   rimraf.sync('dist');
// });

// require('events').EventEmitter.defaultMaxListeners = 0;

// gulp.task('images', () => {
//   gulp
//     .src('src/images/**/*.{jpg,png,gif}')
//     .pipe(
//       cache(
//         imagemin({
//           optimizationLevel: 5,
//           progressive: true,
//           interlaced: true
//         })
//       )
//     )
//     .pipe(gulp.dest('dist/images'));
// });
// // optimization 'tinypng'
// /*
//  gulp.task('image', () =>
//  gulp.src('src/img/*')
//  .pipe(tinypng(tinyApiKey))
//  .pipe(gulp.dest('app/img'))
//  );
//  */
// gulp.task('sass', () =>
//   gulp
//     .src('src/sass/**/*.scss')
//     .pipe(sourcemaps.init())
//     .pipe(
//       sass({
//         outputStyle: 'compressed'
//       })
//     )
//     .on('error', notify.onError(error => `Error: ${error.message}`))
//     .pipe(
//       autoprefixer({
//         browsers: ['last 3 versions', 'ie >= 9', 'android >= 2.3.3', 'iOS >= 6']
//       })
//     )
//     .pipe(
//       rename({
//         suffix: '.min'
//       })
//     )
//     .pipe(sourcemaps.write('./'))
//     .pipe(gulp.dest('dist/css'))
//     .pipe(
//       browserSync.reload({
//         stream: true
//       })
//     )
// );

// gulp.task('scripts', () =>
//   gulp
//     .src(config.js)
//     .pipe(sourcemaps.init())
//     .pipe(concat('scripts.min.js'))
//     .pipe(config.prod ? uglify() : util.noop())
//     .on('error', notify.onError(error => `Error: ${error.message}`))
//     .pipe(sourcemaps.write('./'))
//     .pipe(gulp.dest('dist/js'))
//     .pipe(
//       browserSync.reload({
//         stream: true
//       })
//     )
// );

// gulp.task('views', () =>
//   gulp
//     .src('src/views/pages/*.twig')
//     .pipe(twig())
//     .pipe(htmlbeautify())
//     .on('error', notify.onError(error => `Error: ${error.message}`))
//     .pipe(gulp.dest('dist'))
//     .on('end', () => {
//       browserSync.reload();
//     })
// );

// gulp.task('fonts', () =>
//   gulp.src('src/fonts/**/*.*').pipe(gulp.dest('dist/fonts'))
// );

// gulp.task(
//   gulp.series('build'),
//   gulp.parallel('clean', 'sass', 'fonts', 'scripts', 'images', 'views')
// );

// gulp.task('default', gulp.series('build', 'browserSync'), () => {
//   gulp.watch('src/sass/**/*.scss', ['sass']);
//   gulp.watch('src/js/**/*.js', ['scripts']);
//   gulp.watch('src/images/**/*.{jpg,png,gif}', ['images']);
//   gulp.watch('src/views/**/*.twig', ['views']);
// });
