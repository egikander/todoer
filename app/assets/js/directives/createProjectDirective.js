(function() {
    'use strict';

    var app = angular.module('todoer');

    app.directive('createProject', function() {
        return {
            restrict: 'E',
            templateUrl: 'assets/templates/createproject.html'
        };
    });
})();