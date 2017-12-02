var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat');

var cssSources,
    jsVendorSources,
    jsCustomSources,
    jsSources;

cssSources = ['sass/**/*.scss'];
jsVendorSources = [
    'js/vendor/jquery-3.2.1.min.js',
    //'jsvendor/gsap/jquery.gsap.min.js',
    'js/vendor/gsap/TweenMax.min.js',
    'js/vendor/scrollmagic/uncompressed/ScrollMagic.js',
    'js/vendor/scrollmagic/uncompressed/plugins/animation.gsap.js',
    'js/vendor/scrollmagic/uncompressed/plugins/debug.addIndicators.js'
];
jsCustomSources = [
    'js/main.js'
];
jsSources = jsVendorSources.concat(jsCustomSources);


//check JS with jshint and use jshint-stylish for error report
gulp.task('lint', function(){
    return gulp.src(jsCustomSources)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
});

// concat js files
gulp.task('scripts', ['lint'], function() {
    return gulp.src(jsSources)
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write('./maps/'))
        .pipe(gulp.dest('../js/'))
        .pipe(browserSync.stream());
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src(cssSources)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./maps/'))
        .pipe(gulp.dest("../css/"))
        .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "../"
        //directory: true
    });

    gulp.watch(cssSources, ['sass']);
    gulp.watch("js/*.js", ['scripts']);
    gulp.watch("../*.html").on('change', browserSync.reload);
});

gulp.task('default', ['lint', 'scripts', 'sass',  'serve']);