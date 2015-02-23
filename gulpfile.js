var gulp = require('gulp');
var prettify = require('gulp-prettify');
var docObj = require('./grilled/document-object');
var prismicQuery = require('./grilled/prismic-query');
var renderer = require('./grilled/render');
var rimraf = require('gulp-rimraf');
var gulpIf = require('gulp-if');
var replace = require('gulp-replace');
var express = require('express');
var livereload = require('gulp-livereload');
var lrScript = "<script src='http://localhost:35729/livereload.js'></script>\n</body>";
var lr = require('tiny-lr');
var compression = require('compression');
var concat = require('gulp-concat');
var server = express();
var reload = lr();
var uglify = require('gulp-uglify');
var stylus = require('gulp-stylus');
var sitemap = require('gulp-sitemap');

var paths = {
  styles: './src/css/*.css',
  stylus: './src/stylus/**/*.styl',
  html: './src/**/*.html',
  js: './src/js/*.js'
}

env = process.env.NODE_ENV || 'development';
port = process.env.PORT || 8000;

console.log('Running in env: '+env+'\n server on port: '+port);

gulp.task('build', ['imgs','stylus', 'css', 'js'], function() {
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

gulp.task('default', ['build'], function() {
  return gulp.src('static/**/*.html')
         .pipe(sitemap({siteUrl:'http://style.thoughtworks.com'}))
         .pipe(gulp.dest('./static'))
})

gulp.task('imgs', function() {
  return gulp.src('./src/img/**/*')
        .pipe(gulp.dest('./static/img'))
})

gulp.task('stylus', function() {
  return gulp.src([paths.stylus, '!./src/stylus/**/_*.styl'])
        .pipe(stylus())
        .pipe(gulp.dest('./src/css'))
})

gulp.task('css', function() {
  return gulp.src(paths.styles)
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
  var mocha = require('gulp-mocha');
  
  return gulp.src('./tests/*.js', {read: false})
    .pipe(mocha());
})

gulp.task('watch', function() {
  gulp.watch('./src/stylus/**/*.styl', ['stylus']);
  gulp.watch(paths.styles, ['css']);
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
		.pipe(rimraf());
})

gulp.task('heroku:production', ['default'], function() {

})
