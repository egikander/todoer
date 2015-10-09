(function() {
    'use strict';

    var app = angular.module('todoer');

    app.controller('projectController', ['$scope', 'projectsFactory', 'tasksFactory', '$window',
    function($scope, projectsFactory, tasksFactory, $window) {
        var ctrl = this;
        var _ = $window._;

        ctrl.tasks = tasksFactory.getTasks();
        ctrl.taskDescription = '';

        ctrl.addTask = function(projectId, taskDescription) {
            taskDescription = taskDescription.trim();
            if(taskDescription.length === 0) {
                return;
            }
            tasksFactory.addTask(projectId, taskDescription);
            ctrl.taskDescription = '';
        };

        ctrl.getTasks = function(projectId) {
            return _.filter(ctrl.tasks, {projectId: projectId});
        };

        ctrl.removeProject = function(projectId) {
            projectsFactory.removeProject(projectId);
            tasksFactory.removeTasks(projectId);
        };
    }]);
})();