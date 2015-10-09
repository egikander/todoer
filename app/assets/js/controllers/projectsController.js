(function() {
    'use strict';
    var app = angular.module('todoer');

    app.controller('projectsController', ['$scope', 'projectsFactory', function($scope, projectsFactory) {
        var ctrl = this;

        ctrl.projects = projectsFactory.getProjects();
        ctrl.newProjectName = '';

        ctrl.createProject = function(name) {
            name = name.trim();
            if(name.length === 0) {
                return;
            }
            projectsFactory.createProject(name);
            ctrl.newProjectName = '';
        };
    }]);
})();