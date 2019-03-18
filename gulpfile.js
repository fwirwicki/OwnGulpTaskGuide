"use strict";

const { src, dest, watch, series } = require("gulp");
const plumber = require("gulp-plumber");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const browserSync = require("browser-sync");
const notify = require("gulp-notify");

function serve(cb) {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    })
    cb();
}

function reload(cb) {
    browserSync.reload();
    cb();
}

function errorHandler(err) {
    notify.onError({
        title: 'Gulp',
        subtitle: 'Failure!',
        message: 'Error: <%= error.message %>',
        sound: 'Beep'
    })(err);
    this.emit("end");
}

function watchers() {
    watch(["assets/styles/**/*.scss"], styles);
    watch(["assets/scripts/*.js"], scripts);
    watch(["*.html"], reload);
}

function styles() {
    return src(["assets/styles/main.scss"])
        .pipe(plumber({
            errorHandler
        }))
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 4 version', 'ie 11', 'chrome > 39', 'firefox > 24']
        }))
        .pipe(dest("dist/"))
        .pipe(browserSync.stream());
}

function scripts() {
    return src(["assets/scripts/*.js"])
        .pipe(plumber())
        .pipe(babel({
            presets: ["@babel/env"]
        }))
        .pipe(dest("dist/"))
        .pipe(browserSync.stream());
}

exports.styles = styles;
exports.scripts = scripts;
exports.watch = watchers;

exports.default = series(serve, styles, scripts, watchers);
