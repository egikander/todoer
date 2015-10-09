(function() {
    'use strict';

    var app = angular.module('todoer');

    app.directive('project', function() {
        return {
            restrict: 'E',
            templateUrl: 'assets/templates/project.html',
            controller: 'projectController',
            controllerAs: 'projectCtrl'
        };
    });
})();