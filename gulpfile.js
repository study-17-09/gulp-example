const gulp = require('gulp');
const sass = require('gulp-sass');
const imageMin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const del = require('del');
const jsMinify = require('gulp-js-minify');
const jsUglify = require('gulp-uglify-inline');
const nano = require('cssnano');


function copyHtml() {
	return gulp.src('./src/index.html')
		.pipe(gulp.dest('./dist'))
		.pipe(browserSync.stream());
}

function compileStyles() {
	return gulp.src('./src/scss/main.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./dist/styles'))
		.pipe(browserSync.stream());
}

function buildStyles() {
	return gulp.src('./src/scss/main.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(nano())
		.pipe(gulp.dest('./dist/styles'))
}

function optimizeImages() {
	return gulp.src('./src/img/*')
		.pipe(imageMin())
		.pipe(gulp.dest('./dist/img'))
		.pipe(browserSync.stream());
}

function optimizeJS() {
	return gulp.src('./src/js/**/*.js')
		.pipe(jsMinify())
		.pipe(jsUglify())
		.pipe(gulp.dest('./dist/js'));
}

function watchHtml() {
	return gulp.watch('./src/**/*.html', copyHtml);
}

function watchStyles() {
	return gulp.watch('./src/scss/**/*.scss', compileStyles);
}

function watchImages() {
	gulp.watch('./src/img/*', optimizeImages)
}

function init() {
	return gulp.parallel(
		copyHtml,
		compileStyles,
		optimizeImages
	)
}

function watchFiles() {
	browserSync.init({
		server: {
			baseDir: './dist',
		},
		port: 4220
	});
	return gulp.parallel(
		watchHtml,
		watchStyles,
		watchImages
	);
}

function clear() {
	return del('./dist');
}

exports.build = gulp.series(clear, gulp.parallel(copyHtml, optimizeImages, optimizeJS, buildStyles));
exports.watch = gulp.series(init(), watchFiles());
exports.default = gulp.series(init(), watchFiles());
