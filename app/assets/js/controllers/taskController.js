(function() {
    'use strict';

    var app = angular.module('todoer');

    app.controller('taskController', ['$scope', 'tasksFactory', function($scope, tasksFactory) {
        var ctrl = this;

        ctrl.isEditingTask = false;
        ctrl.editingTask = null;

        ctrl.editTask = function(task) {
            ctrl.isEditingTask = true;
            ctrl.editingTask = angular.copy(task);
        };

        ctrl.updateTask = function() {
            tasksFactory.updateTask(ctrl.editingTask);
            ctrl.isEditingTask = false;
            ctrl.editingTask = null;
        };

        ctrl.taskDone = function(task) {
            tasksFactory.taskDone(task.id);
        };

        ctrl.removeTask = function(task) {
            tasksFactory.removeTask(task.id);
        };

    }]);
})();