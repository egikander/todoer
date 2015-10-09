(function() {
    'use strict';

    var app = angular.module('todoer');

    app.factory('tasksFactory', ['todoerStorage', '$window', function(todoerStorage, $window) {
        var _ = $window._;
        var _STORAGE_KEY = 'tasks';
        var tasks = todoerStorage.load(_STORAGE_KEY) || [];

        return {
            addTask: addTask,
            getTasks: getTasks,
            taskDone: taskDone,
            updateTask: updateTask,
            removeTask: removeTask,
            removeTasks: removeTasks
        };

        function taskUniqueId(prefix) {
            var lastTaskId;
            var taskIdNum;
            if(_.isArray(tasks) && !_.isEmpty(tasks)) {
                lastTaskId = _.last(tasks)['id'];
                taskIdNum = parseInt(lastTaskId.match(/\d+$/g)[0], 10);
            }
            return taskIdNum ? prefix + (++taskIdNum) : prefix + 1;
        }

        function getTasks() {
            return tasks;
        }

        function addTask(projectId, taskDescription) {
            if(!projectId || !taskDescription) {
                return;
            }
            var task = {};
            task.id = taskUniqueId('task_');
            task.description = taskDescription;
            task.projectId = projectId;
            task.done = false;

            tasks.push(task);
            todoerStorage.store(tasks, _STORAGE_KEY);
        }

        function updateTask(newTask) {
            if(!newTask) {
                return;
            }
            var task = _.findWhere(tasks, {id: newTask.id});
            task.description = newTask.description;
            todoerStorage.store(tasks, _STORAGE_KEY);
        }

        function removeTask(taskId) {
            if(!taskId) {
                return;
            }
            _.remove(tasks, function(t) {
                return t.id === taskId;
            });
            todoerStorage.store(tasks, _STORAGE_KEY);
        }

        function removeTasks(projectId) {
            if(!projectId) {
                return;
            }
            _.remove(tasks, function(task) {
                return task.projectId === projectId;
            });
            todoerStorage.store(tasks, _STORAGE_KEY);
        }

        function taskDone(taskId) {
            if(!taskId) {
                return;
            }
            var index = _.findIndex(tasks, function(t) {
                return t.id === taskId;
            });

            tasks[index].done = !tasks[index].done;
            todoerStorage.store(tasks, _STORAGE_KEY);
        }
    }]);
})();