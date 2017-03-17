"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var browserSync = require("browser-sync");

gulp.task("browser-sync", function() {
  browserSync({
    server: {
       baseDir: "./"
    }
  });
});

gulp.task("bs-reload", function () {
  browserSync.reload();
});


gulp.task("styles", function(){
  gulp.src(["app/css/**/*.scss"])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit("end");
    }}))
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer("last 2 versions"))
    .pipe(gulp.dest("dist/"))
    .pipe(browserSync.reload({stream:true}))
});


gulp.task("default", ["styles", "browser-sync"], function(){
  gulp.watch("app/css/**/*.scss", ["styles"]);
  gulp.watch("*.html", ["bs-reload"]);
});
