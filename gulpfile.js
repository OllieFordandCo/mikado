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
    babel: require('gulp-babel'),
    jshint: require('gulp-jshint'),
    concat: require('gulp-concat'),
    async: require('async'),
    jspm: require('gulp-jspm'),
    sourcemaps: require('gulp-sourcemaps')
};

/*
 * Extracting Main Javascript Files to the src/js/vendor for Minification
 */

let vendorList = [
    ['./node_modules/promise-polyfill/promise.min.js', 'promise.min.js'],
    ['./node_modules/smoothscroll-polyfill/dist/smoothscroll.js', 'smoothscroll.min.js'],
    ['./node_modules/raf.js/raf.js', 'raf.min.js'],
    ['./node_modules/picturefill/dist/picturefill.js', 'picturefill.min.js'],
    ['./node_modules/es5-shim/es5-shim.min.js', 'es5-shim.min.js'],
    ['./node_modules/domtokenlist-shim/dist/domtokenlist.min.js', 'domtokenlist.min.js'],
    ['./node_modules/custom-event-polyfill/custom-event-polyfill.js', 'custom-event.min.js'],
    ['./node_modules/validate/dist/validityState-polyfill.js', 'validityState-polyfill.min.js']
];

function jsVendors(vendor) {
    return gulp.src(vendor[0])
        .pipe($.rename('dist/js/vendor/'+vendor[1]))
        .pipe(gulp.dest('./'));
}

gulp.task('cp-vendors', function(cb) {
    let vendors = [];
    vendorList.forEach(function(vendor) {
        vendors.push(function(next) {
            jsVendors(vendor).on('end', next);
        });
    });
    $.async.series(vendors, cb);
});

/*
 * Extracting Modules for Mikado use
 */

let moduleList = [
    ['./node_modules/systemjs/dist/system.js', 'system.min.js'],
    ['./node_modules/validate/dist/js/validate.js', 'validate.min.js'],
    ['./node_modules/lazysizes/lazysizes.js', 'lazysizes.min.js'],
    ['./node_modules/lazysizes/plugins/unveilhooks/ls.unveilhooks.js', 'ls.unveilhooks.min.js']
];

function jsModules(vendor) {
    return gulp.src(vendor[0])
        .pipe($.rename('dist/js/mikado/modules/'+vendor[1]))
        .pipe(gulp.dest('./'));
}

gulp.task('cp-modules', function(cb) {
    let modules = [];
    moduleList.forEach(function(module) {
        modules.push(function(next) {
            jsModules(module).on('end', next);
        });
    });
    $.async.series(modules, cb);
});

/*
 Other Gulp Tasks
 */

gulp.task('base-js', function(){
    return gulp.src('./src/js/base/base.js')
        .pipe($.babel({
            presets: ["es2015"]
        }))
        .pipe($.uglify())
        .pipe(gulp.dest('dist/js/base'));
});

gulp.task('modules-js', function(){
    return gulp.src('./src/js/modules/**/*.js')
        .pipe($.babel({
            presets: ["es2015"]
        }))
        .pipe($.uglify())
        .pipe(gulp.dest('dist/js/mikado/modules/'));
});

gulp.task('mikado-js', function(){
    return gulp.src(['./src/js/mikado/mikado.js'])
        .pipe($.concat('mikado.js'))
        .pipe($.babel({
            presets: ["es2015"]
        }))
        .pipe($.uglify())
        .pipe(gulp.dest('dist/js/mikado'));
});

gulp.task('modules-es5-js', function(){
    return gulp.src('./src/js/modules-es5/**/*.js')
        .pipe($.uglify())
        .pipe(gulp.dest('dist/js/mikado/modules/'));
});