'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    notify = require("gulp-notify"),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    //optimization of image files (https://tinypng.com/)
    //tinypng = require('gulp-tinypng'),
    //Developer Api Key - https://tinypng.com/
    //tinyApiKey = '',
    twig = require('gulp-twig'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    rimraf = require('rimraf'),
    htmlbeautify = require('gulp-html-beautify'),
    util = require('gulp-util');

var config = {
    js: [
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
        'src/js/scripts.js'
    ],
    prod: !!util.env.prod
};

gulp.task('browserSync', function () {
    browserSync({
        server: {
            baseDir: "dist"
        }
    });
});

gulp.task('clean', function () {
    rimraf.sync('dist');
});

require('events').EventEmitter.defaultMaxListeners = 0;

gulp.task('images', function () {
    gulp.src('src/img/**/*.{jpg,png,gif}')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});
//optimization 'tinypng'
/*
 gulp.task('image', () =>
 gulp.src('src/img/*')
 .pipe(tinypng(tinyApiKey))
 .pipe(gulp.dest('app/img'))
 );
 */
gulp.task('sass', function () {
    return gulp.src('src/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .on("error", notify.onError(function (error) {
            return "Error: " + error.message;
        }))
        .pipe(autoprefixer({
            browsers: ['last 3 versions', 'ie >= 9', 'android >= 2.3.3', 'iOS >= 6']
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css')).pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('scripts', function () {
    return gulp.src(config.js)
        .pipe(sourcemaps.init())
        .pipe(concat('scripts.min.js'))
        .pipe(config.prod ? uglify() : util.noop())
        .on("error", notify.onError(function (error) {
            return "Error: " + error.message;
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/js')).pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('views', function () {
    return gulp.src('src/views/pages/*.twig')
        .pipe(twig())
        .pipe(htmlbeautify())
        .on("error", notify.onError(function (error) {
            return "Error: " + error.message;
        }))
        .pipe(gulp.dest('dist')).on('end', function () {
            browserSync.reload();
        });
});

gulp.task('fonts', function () {
    return gulp.src('src/fonts/**/*.*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('build', ['clean', 'sass', 'fonts', 'scripts', 'images', 'views']);

gulp.task('default', ['build', 'browserSync'], function () {
    gulp.watch('src/sass/**/*.scss', ['sass']);
    gulp.watch('src/js/**/*.js', ['scripts']);
    gulp.watch('src/img/**/*.{jpg,png,gif}', ['images']);
    gulp.watch('src/views/**/*.twig', ['views']);
});