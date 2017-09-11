var gulp = require('gulp');
var $ = {
    gutil: require('gulp-util'),
    rename: require('gulp-rename'),
    merge: require('merge-stream'),
    uglify: require('gulp-uglify'),
    uglifyjs: require('uglify-js'),
    minifier: require('gulp-uglify/minifier'),
    plumber: require('gulp-plumber'),
    pump: require('pump'),
    jshint: require('gulp-jshint'),
    concat: require('gulp-concat'),
    async: require('async'),
    jspm: require('gulp-jspm'),
    sourcemaps: require('gulp-sourcemaps')
};

/*
 Gulp Functions - Use on Gulp Tasks
 */

var jsVendors = [
    ['./node_modules/promise-polyfill/promise.min.js', 'promise.min.js'],
    ['./node_modules/smoothscroll-polyfill/dist/smoothscroll.js', 'smoothscroll.min.js'],
    ['./node_modules/raf.js/raf.js', 'raf.min.js'],
    ['./node_modules/picturefill/dist/picturefill.js', 'picturefill.min.js'],
    ['./node_modules/es5-shim/es5-shim.min.js', 'es5-shim.min.js'],
    ['./node_modules/domtokenlist-shim/dist/domtokenlist.min.js', 'domtokenlist.min.js'],
    ['./node_modules/custom-event-polyfill/custom-event-polyfill.js', 'custom-event.min.js']
];

/*
 * Extracting Main Javascript Files to the src/js/vendor for Minification
 */

function jsModules(vendor) {
    return gulp.src(vendor[0])
        .pipe($.rename('dist/js/vendor/'+vendor[1]))
        .pipe(gulp.dest('./'));
}


/*
 Gulp Tasks
 */

gulp.task('cp-vendors', function(cb) {
    var vendors = [];
    jsVendors.forEach(function(vendor) {
        vendors.push(function(next) {
            jsModules(vendor).on('end', next);
        });
    });
    $.async.series(vendors, cb);
});

gulp.task('base-js', function(){
    var asset_url = './src/js/base/';
    return gulp.src(
        [
            asset_url+'noJs.js',
            asset_url+'loadScript.js',
            asset_url+'polyfills.js',
            asset_url+'loadCss.js',
            asset_url+'dataCritical.js',
            asset_url+'deferredStyles.js',
            asset_url+'bodyScrolled.js'
        ])
        .pipe($.concat('base.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest('dist/js/base'));
});

gulp.task('modules-js', function(){
    return gulp.src('./src/js/modules/**/*.js')
        .pipe($.uglify())
        .pipe(gulp.dest('dist/js/modules/'));
});