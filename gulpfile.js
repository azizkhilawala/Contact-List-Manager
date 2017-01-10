var gulp = require('gulp');
// var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
// var resize = require('gulp-image-resize');
var pkg = require('./package.json');

// Set the banner content
var banner = ['/*!\n',
    ' * Aziz Khilawala - <%= pkg.title %> v<%= pkg.version %>\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' */\n',
    ''
].join('');

// // Compile LESS files from /less into /css
// gulp.task('less', function() {
//     return gulp.src('less/creative.less')
//         .pipe(less())
//         .pipe(header(banner, {
//             pkg: pkg
//         }))
//         .pipe(gulp.dest('css'))
//         .pipe(browserSync.reload({
//             stream: true
//         }));
// });

// Minify compiled CSS
gulp.task('minify-css', function() {
    return gulp.src('app/app.css')
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src(['app/app.js'])
        .pipe(uglify())
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('app/js/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function() {
    gulp.src(['app/bower_components/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('app/vendor/bootstrap'));

    gulp.src(['app/bower_components/jquery/dist/jquery.js', 'app/bower_components/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('app/vendor/jquery'));

    gulp.src(['app/bower_components/html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js'])
        .pipe(gulp.dest('app/vendor/modernizr'));

    gulp.src(['app/bower_components/html5-boilerplate/dist/css/normalize.css'])
        .pipe(gulp.dest('app/vendor/normalize'));

    gulp.src(['app/bower_components/html5-boilerplate/dist/css/main.css'])
        .pipe(gulp.dest('app/vendor/main'));

    gulp.src(['app/bower_components/angular/angular.min.js'])
        .pipe(gulp.dest('app/vendor/angular'));

    gulp.src(['app/bower_components/angular-route/angular-route.min.js'])
        .pipe(gulp.dest('app/vendor/angular-route'));

    gulp.src(['app/bower_components/angularfire/dist/angularfire.min.js'])
        .pipe(gulp.dest('app/vendor/angularfire'));

});

// Resize images
// gulp.task('resize', function() {
//
//     gulp.src('img/header1.jpg')
//         .pipe(resize({
//             width: 1280,
//             crop: false,
//             upscale: false,
//             noProfile: true,
//             imageMagick: true
//         })).pipe(gulp.dest('img/header'));
//
//     gulp.src('img/debt.jpeg')
//         .pipe(resize({
//             width: 640,
//             crop: false,
//             upscale: false,
//             noProfile: true,
//             imageMagick: true
//         })).pipe(gulp.dest('img/section'));
//
// });

// Run everything
gulp.task('default', ['minify-css', 'minify-js', 'copy']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        },
    });
});

// // Dev task with browserSync
gulp.task('dev', ['browserSync', 'minify-css', 'minify-js'], function() {
    // gulp.watch('less/*.less', ['less']);
    gulp.watch('app/app.css', ['minify-css']);
    gulp.watch('app/app.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('app/*.css', browserSync.reload);
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('app/*.js', browserSync.reload);
});
