var gulp = require('gulp');
var baked = require('baked/gulp');
var potato = require('potato.js');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var helpers = require('./src/helpers');
var del = require('del');
var ghPages = require('gh-pages');
var rimraf = require('rimraf');
var path = require('path');
var sitemap = require('gulp-sitemap');

GLOBAL.potato = potato;

// Make helpers global so they can be used in templates
GLOBAL.helpers = helpers;

//Define our source & destination paths
var paths = {
  stylus: {
    src: './src/stylus/styles.styl',
    dst: './generated/css'
  },
  js: {
    src: './src/js/*.js',
    dst: './generated/js'
  },
  img: {
    src: './src/img/**/*',
    dst: './generated/img'
  },
  heroku: {
    src: './heroku/**/*',
    dst: './generated/'
  },
};

// Render all .styl (Stylus) files and add the css to generated
gulp.task('stylus', function () {
  gulp.src(paths.stylus.src)
    .pipe(stylus())
    .pipe(gulp.dest(paths.stylus.dst));
});

/**
 Add concatinted JS files to generated directory
*/
gulp.task('js', function() {
  return gulp.src(paths.js.src)
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.js.dst))
});

// Add Imgages to generated directory
gulp.task('imgs', function() {
  return gulp.src(paths.img.src)
        .pipe(gulp.dest(paths.img.dst))
})

/**
 Remove unecessary generated files so they're not 
 copied over to the repo.
*/
gulp.task('clean-generated', function(cb) {
  return del([
            './generated/_*.?(html|json)',
            './generated/bootstrap',
            './generated/bootstrap.html',
            './generated/page.html',
            './generated/*.html.tmpl'
            ], function(err, deletedFiles) {
              console.log('Files deleted:\n', deletedFiles.join('\n'));
              cb(err, deletedFiles);
            })
});

/**
 Remove generated and repo directory & files
*/
gulp.task('clean', function(cb) {
  del(['./generated'], function(err, deletedFiles) {
    if(err) console.log('## ERROR ',err);
    console.log('Files deleted:', deletedFiles.join(', '));
    cb(err, deletedFiles);
  })
})

/**
 Tests the parser and the helper files
*/
gulp.task('test:helpers', function() {
  var mocha = require('gulp-mocha');
  return gulp.src('./tests/helpers.js', {read: false})
    .pipe(mocha());
})

gulp.task('test:parser', function() {
  var mocha = require('gulp-mocha');
  return gulp.src('./tests/parser.js', {read: false})
    .pipe(mocha());
})

// Runs test on all test files
gulp.task('test', function() {
  var mocha = require('gulp-mocha');
  return gulp.src(['./tests/parser.js', './tests/helpers.js'], {read: false})
    .pipe(mocha());
})

/**
 Copy over heroku files into staging repo
*/
gulp.task('heroku-config', function() {
  return gulp.src(paths.heroku.src)
        .pipe(gulp.dest(paths.heroku.dst))
})

/**
 Generate a sitemap (production only)
 We need to clean the out the generated folder first, though
*/
gulp.task('sitemap', ['clean-generated'], function() {
  return gulp.src('generated/**/*.html')
         .pipe(sitemap({siteUrl:'http://style.thoughtworks.com'}))
         .pipe(gulp.dest('./generated'))
});

/**
 Deploy site to staging environment on Heroku. 
 Creates a .publish-staging dir in root of project
*/
gulp.task('deploy:staging', ['heroku-config'], function(callback) {
  ghPages.publish(path.join(__dirname, 'generated'), {
    branch: 'master',
    repo: 'https://git.heroku.com/staging-tw-writing-guide.git',
    clone: './.publish-staging',
    user: {
      name: 'grommett',
      email: 'david@smithandrobot.com'
    }
  }, callback);
});

/**
 Deploy site to to production environment on Heroku. 
 Creates a .publish-production dir in root of project
*/
gulp.task('deploy:production', ['heroku-config'], function(callback) {
  ghPages.publish(path.join(__dirname, 'generated'), {
    clone: './.publish-production',
    branch: 'master',
    repo: 'https://git.heroku.com/production-tw-writing-guide.git',
  }, callback);
});

gulp.task('default', ['baked:default', 'stylus', 'js', 'imgs']);
gulp.task('serve', ['baked:serve']);
