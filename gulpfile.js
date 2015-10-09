//include gulp plugins
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var cache = require('gulp-cache');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var minifyCss = require('gulp-minify-css');
var notify = require('gulp-notify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var util = require('gulp-util');
var ngAnnotate = require('gulp-ng-annotate');
var server = require('gulp-server-livereload');
var plumber = require('gulp-plumber');
var bootlint = require('gulp-bootlint');
var csslint = require('gulp-csslint');
var karma = require('karma').Server;
var protractor = require('gulp-protractor').protractor;
var path = require('path');
var glob = require('glob');
var child_process = require('child_process');

//DEBUG
var debug = require('gulp-debug');

/*
*
* Env variables
*
*/

//Application directory
var _APP_DIR = 'app';

//Deploy directory
var _BUILD_DIR = 'build';

//Notify enabled
var _NOTIFY_ENABLED = false;

//Notify decorator for enable/disable notifier
var notify = function() {
    return _NOTIFY_ENABLED ? notify : util.noop;
}();

//Bower paths for main-bower-files plugin
var bowerFilesOptions = {
    bowerDirectory: 'bower_components',
    bowerrc: '.bowerrc',
    bowerJson: 'bower.json'
};

//Bower overrides for main-bower-files plugin
var bowerOverrides = {
    'jquery' : {
        main: ['./dist/jquery.min.js']
    },
    'bootstrap': {
        main: ['./dist/css/bootstrap.min.css', './dist/js/bootstrap.min.js', './dist/fonts/**/*']
    },
    'angular': {
        main: ['angular.min.js']
    },
    'lodash': {
        main: ['lodash.min.js']
    }
};

//Filter files by extension
var filterByExtension = function(ext) {
    return filter(function(file) {
        return file.path.match(new RegExp('.' + ext + '$'));
    });
};

//Minify & autoprefixer css task
gulp.task('styles', function() {
    return gulp.src('app/assets/css/**/*.css')
        .pipe(csslint())
        .pipe(plumber())
        .pipe(autoprefixer('last 2 version'))
        .pipe(minifyCss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(_BUILD_DIR + '/assets/css'))
        .pipe(notify({message: 'Styles task complete'}));
});

//Copy bower dependency css files
gulp.task('bower-files-css', function() {
    var bowerFiles = mainBowerFiles({paths: bowerFilesOptions, overrides: bowerOverrides});

    if(!bowerFiles.length) return;

    var cssFilter = filterByExtension('css');

    return gulp.src(bowerFiles)
        .pipe(cssFilter)
        .pipe(gulp.dest(_BUILD_DIR + '/assets/css'))
        .pipe(notify({message: 'Bower css files copied'}));
});

//Lint, minify, copy js scripts
gulp.task('scripts', function() {
    return gulp.src('app/assets/js/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(plumber())
        .pipe(ngAnnotate({remove: true, add: true, single_quotes: true}))
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(_BUILD_DIR + '/assets/js'))
        .pipe(notify({message: 'Scripts task complete'}));
});

//Copy bower dependency js files
gulp.task('bower-files-js', function() {
    var bowerFiles = mainBowerFiles({paths: bowerFilesOptions, overrides: bowerOverrides});

    if(!bowerFiles.length) return;
    var jsFilter = filterByExtension('js');

    return gulp.src(bowerFiles)
        .pipe(jsFilter)
        .pipe(gulp.dest(_BUILD_DIR + '/assets/js'))
        .pipe(notify({message: 'Bower js files copied'}));
});

//Copy images
gulp.task('copy-img', function() {
    return gulp.src(_APP_DIR + '/assets/img/**/*')
        .pipe(gulp.dest(_BUILD_DIR + '/assets/img'))
        .pipe(notify({massage: 'Images copied'}));
});

//Copy fonts
gulp.task('copy-fonts', function() {
    return gulp.src(_APP_DIR + '/assets/fonts/**/*')
        .pipe(gulp.dest(_BUILD_DIR + '/assets/fonts'))
        .pipe(notify({message: 'Fonts copied'}));
});

//Copy bootstrap fonts
gulp.task('bower-files-fonts', function() {
    var bowerFonts = mainBowerFiles({filter: /\.(eot|svg|ttf|woff|woff2)$/, paths: bowerFilesOptions, overrides: bowerOverrides});

    return gulp.src(bowerFonts)
        .pipe(gulp.dest(_BUILD_DIR + '/assets/fonts'))
        .pipe(notify({message: 'Bower fonts copied'}));
});

//Copy html
gulp.task('copy-html', function() {
    return gulp.src(_APP_DIR + '/**/*.html')
        .pipe(bootlint())
        .pipe(gulp.dest(_BUILD_DIR + '/'))
        .pipe(notify({message: 'HTML files copied'}));
});

//Run unit tests
gulp.task('test:unit', function(done) {
    new karma({
        configFile: __dirname + '/tests/karma-conf.js',
        singleRun: true
    }, function() {
        done();
    }).start();
});

//Start webdriver standalone (for E2E tests)
gulp.task('webdriver_standalone',function(done) {
    child_process.spawn(path.resolve(require("gulp-protractor").getProtractorDir() + '/webdriver-manager'), ['update', '--standalone'], {
        stdio: 'inherit'
    }).once('close', done);
});

function runE2eTests(baseUrl, done) {
    var searchPath = path.join(__dirname, 'node_modules', 'protractor', 'selenium', 'selenium-server-*.jar');
    var files = glob.sync(searchPath);
    var jarPath = files[0];

    if(!jarPath) {
        throw new Error('Unable to find ' + searchPath);
    }

    gulp.src(["./tests/e2e/**/*.js"])
        .pipe(protractor({
            seleniumServerJar: jarPath,
            configFile: __dirname + "/tests/protractor-conf.js",
            args: ['--baseUrl', baseUrl]
        }))
        .on('error', function(e) { throw e })
        .on('end', function() {
            done();
        });
}

//Run E2E tests
gulp.task('test:e2e', ['webdriver_standalone'], function (done) {
    var buildServe = gulp.src(_BUILD_DIR)
        .pipe(server({
            host: '0.0.0.0',
            port: 8080,
            directoryListing: false,
            open: false,
            https: false
    }));
    runE2eTests('http://localhost:8080/', function() {
        buildServe.emit('kill');
        done();
    });
});

//Clean build directory
gulp.task('clean', function(done) {
    del([_BUILD_DIR + '/**/*'], function() {
        util.log(_BUILD_DIR + ' directory cleaned');
        done();
    });
});

//Watch
gulp.task('watch', function() {
    gulp.watch([_APP_DIR + '/**/*.css'], ['styles']);
    gulp.watch([_APP_DIR + '/**/*.js'], ['scripts']);
    gulp.watch([_APP_DIR + '/**/*.html'], ['copy-html']);
});

//web server
gulp.task('webserver', function() {
    gulp.src(_BUILD_DIR)
        .pipe(server({
            host: '0.0.0.0',
            port: 8080,
            livereload: true,
            directoryListing: false,
            open: false,
            https: false
    }));
});

gulp.task('dev', ['build', 'watch', 'webserver']);

gulp.task('build', ['clean'], function() {
    gulp.start(['styles', 'scripts', 'bower-files-css', 'bower-files-js', 'bower-files-fonts', 'copy-img', 'copy-fonts', 'copy-html']);
});

gulp.task('default', ['build']);