// Include gulp
var gulp = require('gulp');

var react = require('gulp-react'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    stylish = require('jshint-stylish'),
    less = require('gulp-less'),
    plumber = require("gulp-plumber");
var uglify = require('gulp-uglify');

var jest = require('gulp-jest');
var docco = require('gulp-docco'),
    folderToc = require("folder-toc");

var browserSync = require("browser-sync");

gulp.task('test', function () {
    return gulp.src('__tests__').pipe(jest({
        testDirectoryName: "spec",
        scriptPreprocessor: './support/preprocessor.js',
        unmockedModulePathPatterns: ['node_modules/react'],
        testPathIgnorePatterns: [
            "node_modules",
            "./support"
        ]
    }));
});

gulp.task('builddocs', function () {
    gulp.src(['src/*/*.js', 'src/*.js'])
        .pipe(docco())
        .pipe(gulp.dest('./docs'));
});

gulp.task('docsindex', function () {
    folderToc('docs', {
        name: 'index.html',
        layout: 'classic',
        filter: '*.html',
        title: 'Files'
    });
});


gulp.task('browserify', function () {
    return gulp.src('src/main.js')
        .pipe(plumber())
        .pipe(browserify({transform: "reactify"}))
        .pipe(concat('main.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('copyindex', function () {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('lint', function () {
    gulp.src(['src/*/*.js', 'src/*.js'])
        .pipe(plumber())
        .pipe(react())
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
    //.pipe(jshint.reporter('fail'));
});

gulp.task('less', function () {
    return gulp.src('src/less/*.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', function () {
    gulp.watch('src/less/*.less', ['less', browserSync.reload]);
    gulp.watch('src/index.html', ['copyindex', browserSync.reload]);
    gulp.watch(['src/*/*.js', 'src/*.js'], ['lint', 'browserify', browserSync.reload]);
});

// start sync server
gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: "./dist"
        }
    });
});

gulp.task('default', ['lint', 'less', 'browserify', 'copyindex']);
gulp.task('watch_task', ['browser-sync', 'default', 'watch']);
gulp.task('docs', ['builddocs', 'docsindex']);