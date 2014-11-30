// Include gulp
var gulp = require('gulp');

var react = require('gulp-react'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    stylish = require('jshint-stylish'),
    less = require('gulp-less'),
    plumber = require("gulp-plumber");

var jest = require('gulp-jest');
var docco = require('gulp-docco'),
    folderToc = require("folder-toc");

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
    gulp.src('src/main.js')
        .pipe(plumber())
        .pipe(browserify({transform: "reactify"}))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('copyindex', function () {
    gulp.src('src/index.html')
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

/*// Compile Our less
gulp.task('sass', function () {
    return gulp.src('sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('css'));
});*/

gulp.task('less', function () {
    gulp.src('src/less/*.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', function () {
    gulp.watch('src/less/*.less', ['less']);
    gulp.watch('src/index.html', ['copyindex']);
    gulp.watch(['src/*/*.js', 'src/*.js'], ['lint', 'browserify']);
});

gulp.task('default', ['lint', 'less', 'browserify', 'copyindex']);
gulp.task('watch_task', ['default', 'watch']);
gulp.task('docs', ['builddocs', 'docsindex']);