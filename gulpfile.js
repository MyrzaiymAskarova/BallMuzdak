const gulp = require("gulp"),
  browserSync = require("browser-sync"),
  sass = require("gulp-sass"),
  concat = require("gulp-concat"),
  babel = require("gulp-babel"),
  csso = require("gulp-csso"),
  uglify = require("gulp-uglify-es").default,
  autoprefixer = require("gulp-autoprefixer"),
  imagemin = require("gulp-imagemin"),
  newer = require("gulp-newer"),
  del = require("del");

const src = "src/",
  dist = "dist/";

const config = {
  src: {
    html: src + "**/*.html",
    style: src + "scss/**/*.scss",
    js: src + "js/**/*.js",
    fonts: src + "fonts/**/*.*",
    img: src + "images/**/*.*",
    cssLibs: src + "libs/css/*.css",
    jsLibs: src + "libs/js/*.js",
  },
  dist: {
    html: dist,
    style: dist + "css/",
    js: dist + "js/",
    fonts: dist + "fonts/",
    img: dist + "images/",
  },
  watch: {
    html: src + "**/*.html",
    style: src + "scss/**/*.scss",
    js: src + "js/**/*.js",
    fonts: src + "fonts/**/*.*",
    img: src + "images/**/*.*",
    cssLibs: src + "libs/css/*.css",
    jsLibs: src + "libs/js/*.js",
  },
};

const webServer = () => {
  browserSync.init({
    server: {
      baseDir: dist,
    },
    host: "localhost",
    notify: false,
  });
};

const htmlTask = () => {
  return gulp
    .src(config.src.html)
    .pipe(gulp.dest(config.dist.html))
    .pipe(browserSync.reload({ stream: true }))};

 gulp.task("html", htmlTask);


 const scssTask = () => {
    return gulp
      .src(config.src.style)
      .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
      .pipe(concat("main.min.css"))
      .pipe(
        autoprefixer({
          overrideBrowserslist: ["last 10 version"],
          grid: true,
        })
      )
      .pipe(gulp.dest(config.dist.style))
      .pipe(browserSync.reload({ stream: true }));
  };
  
  const jsTask = () => {
    return gulp
      .src(config.src.js)
      .pipe(
        babel({
          presets: ["@babel/preset-env"],
        })
      )
      .pipe(uglify())
      .pipe(gulp.dest(config.dist.js))
      .pipe(browserSync.reload({ stream: true }));
  };
  
  const imgTask = () => {
    return gulp
      .src(config.src.img)
      .pipe(newer(config.src.img))
      .pipe(
        imagemin([
          imagemin.mozjpeg({ quality: 50, progressive: true }),
          imagemin.optipng({ optimizationLevel: 3 }),
          imagemin.svgo({
            plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
          }),
        ])
      )
      .pipe(gulp.dest(config.dist.img))
      .pipe(browserSync.reload({ stream: true }));
  };
  
  const fontsTask = () => {
    return gulp
      .src(config.src.fonts)
      .pipe(gulp.dest(config.dist.fonts))
      .pipe(browserSync.reload({ stream: true }));
  };
  
  const cssLibsTask = () => {
    return gulp
      .src(config.src.cssLibs)
      .pipe(csso())
      .pipe(gulp.dest(config.dist.style))
      .pipe(browserSync.reload({ stream: true }));
  };
  
  // For concated css libs in one file //
  /*
  const cssLibsTask = () => {
    return gulp
      .src(config.src.cssLibs)
      .pipe(concat("vendors.min.css"))
      .pipe(csso())
      .pipe(gulp.dest(config.dist.style))
      .pipe(browserSync.reload({ stream: true }));
  };
  */
  
  const jsLibsTask = () => {
    return gulp
      .src(config.src.jsLibs)
      .pipe(uglify())
      .pipe(gulp.dest(config.dist.js))
      .pipe(browserSync.reload({ stream: true }));
  };
  
  // For concated js libs in one file //
  /*
  const jsLibsTask = () => {
    return gulp
      .src(config.src.jsLibsTask)
      .pipe(concat("vendors.min.js"))
      .pipe(uglify())
      .pipe(gulp.dest(config.dist.js))
      .pipe(browserSync.reload({ stream: true }));
  };
  */
  
  const cleanDist = () => {
    return del("dist");
  };
  
  const watchFiles = () => {
    gulp.watch([config.watch.html], gulp.series(htmlTask));
    gulp.watch([config.watch.style], gulp.series(scssTask));
    gulp.watch([config.watch.js], gulp.series(jsTask));
    gulp.watch([config.watch.img], gulp.series(imgTask));
    gulp.watch([config.watch.fonts], gulp.series(fontsTask));
    gulp.watch([config.watch.cssLibs], gulp.series(cssLibsTask));
    gulp.watch([config.watch.jsLibs], gulp.series(jsLibsTask));
  };
  
  const start = gulp.series(
    htmlTask,
    scssTask,
    jsTask,
    imgTask,
    fontsTask,
    cssLibsTask,
    jsLibsTask
  );
  
  exports.default = gulp.parallel(start, watchFiles, webServer);
  
  exports.build = gulp.series(
    cleanDist,
    htmlTask,
    scssTask,
    cssLibsTask,
    jsTask,
    jsLibsTask,
    imgTask,
    fontsTask
  );
 
