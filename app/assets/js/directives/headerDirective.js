(function() {
    'use strict';
    var app = angular.module('todoer');

    app.directive('header', function() {
        return {
            restrict: 'E',
            templateUrl: 'assets/templates/header.html'
        };
    });
})();