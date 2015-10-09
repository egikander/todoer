module.exports = function(config) {
    config.set({
        basePath: '../',

        files: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/lodash/lodash.js',
            'app/assets/js/**/*.js',
            'tests/unit/**/*_spec.js',
            'app/assets/templates/**/*.html'
        ],

        autoWatch: false,

        frameworks: ['jasmine'],

        browsers: ['Chrome', 'PhantomJS'],

        reporters: ['spec', 'coverage'],

        preprocessors: {
            'app/assets/templates/**/*.html' : ['ng-html2js'],
            'app/assets/js/**/*.js': 'coverage'
        },

        plugins:  [
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-ng-html2js-preprocessor',
            'karma-coverage',
            'karma-spec-reporter'
        ],

        ngHtml2JsPreprocessor : {
            moduleName: 'todoer',
            stripPrefix: 'app/'
        },

        coverageReporter: {
            type: 'text',
            dir: 'tests/tests-results/coverage/',
            file: 'coverage.txt'
        },

        specReporter: {
            maxLogLines: 5
        },

        colors: true,
        logLevel: config.LOG_INFO
    });
};