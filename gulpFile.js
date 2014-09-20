var gulp = require('gulp');
var prettify = require('gulp-prettify');
var mocha = require('gulp-mocha');
var docObj = require('./grilled/document-object');
var prismicQuery = require('./grilled/prismic-query');
var renderer = require('./grilled/render');
var rimraf = require('gulp-rimraf');
var gulpIf = require('gulp-if');
var replace = require('gulp-replace');
var express = require('express');
var sass = require('gulp-ruby-sass');
var livereload = require('gulp-livereload');
var lrScript = "<script src='http://localhost:35729/livereload.js'></script>\n</body>";
var lr = require('tiny-lr');
var compression = require('compression')
var concat = require('gulp-concat');
var server = express();
var reload = lr();
var uglify = require('gulp-uglify');

var paths = {
  styles: './src/css/**/*.css',
  sass: ['./src/sass/**/*.scss', '!/static/sass/**/_*.scss'],
  html: './src/**/*.html',
  js: './src/js/*.js'
}

env = process.env.NODE_ENV || 'development';
port = process.env.PORT || 8000;

console.log('Running in env: '+env+'\n server on port: '+port);

gulp.task('default', ['imgs','sass'], function() {
  var scriptsRe = /<\!--.*?Scripts([^*]+)End Scripts.*?>/g;
  return gulp.src([paths.html, '!./src/_layouts/**', '!./src/_partials/**'], {read:true})
  .pipe(docObj.get())
  .pipe(prismicQuery.getPrismicData())
  .pipe(renderer.render())
  .pipe(gulpIf(env==='development',replace(/<\/body\>/, lrScript)))
  .pipe(replace(scriptsRe, '<script src="/js/all.js"></script>'))
  .pipe(prettify({indent_size: 2, indent_inner_html: true}))
  .pipe(gulp.dest('./static/'))
  .pipe(gulpIf(env==='development',livereload(reload)))

})

gulp.task('imgs', function() {
  return gulp.src('./src/img/*.jpg', {read:true})
        .pipe(gulp.dest('./static/img'))
})

gulp.task('css', function() {
  return gulp.src(paths.styles, {read:false})
        .pipe(gulp.dest('./static/css'))
        .pipe(gulpIf(env==='development',livereload(reload)))
})

gulp.task('sass', function() {
  return gulp.src(paths.sass)
        .pipe(sass({ style: 'nested' }))
        .pipe(gulp.dest('./static/css'))
        .pipe(gulpIf(env === 'development',livereload(reload)))
})

gulp.task('js', function() {
  return gulp.src(paths.js)
        .pipe(gulp.dest('./static/js'))
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./static/js/'))
        .pipe(gulpIf(env==='development',livereload(reload)))
})

gulp.task('test', function() {
  return gulp.src('./tests/*.js', {read: false})
    .pipe(mocha());
})

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.html, ['default']);
  gulp.watch(paths.js, ['js']);
});

gulp.task('serve', function() {
  if(env !== 'development') server.use(cacheHeader())
  server.use(compression());
  server.use(express.static('./static'));
  server.listen(port);
  if(env === 'development') reload.listen(35729);
  gulp.start(gulpIf(env === 'development','watch'));

});

gulp.task('clean', function() {
	gulp.src(['./static'], {read:false})
		.pipe(rimraf())
})

gulp.task('heroku:production', ['default'], function() {
})
// Add cache headers to express response
function cacheHeader() {
  return (function (req, res, next) {
    res.setHeader("Cache-Control", "public, max-age=345600"); // 4 days
    res.setHeader("Expires", new Date(Date.now() + 345600000).toUTCString());
    return next();
  })
}
