(function() {
    'use strict';
    var app = angular.module('todoer');

    app.directive('todoer', function() {
        return {
            restrict: 'E',
            templateUrl: 'assets/templates/todoer.html',
            controller: 'projectsController',
            controllerAs: 'projectsCtrl'
        };
    });
})();