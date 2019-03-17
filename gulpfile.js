"use strict";

const { src, dest, watch, series } = require("gulp");
const plumber = require("gulp-plumber");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const browserSync = require("browser-sync");

function sync(cb) {
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
    console.log(err.message);
    this.emit("end");
}

function watchers() {
    watch(["assets/styles/**/*.scss"], styles);
    watch(["assets/scripts/*.js"], scripts);
    watch(["*.html"], reload);
}

function styles() {
    return src(["assets/styles/main.scss"])
        .pipe(plumber())
        .pipe(sass().on("error", errorHandler))
        .pipe(autoprefixer("last 2 version"))
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

exports.default = series(sync, styles, scripts, watchers);
