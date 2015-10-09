(function() {
    'use strict';

    var app = angular.module('todoer');

    app.factory('projectsFactory', ['todoerStorage', '$window',function(todoerStorage, $window) {
        var _ = $window._;
        var _STORAGE_KEY = 'projects';
        var projects = todoerStorage.load(_STORAGE_KEY) || [];

        return {
            createProject: createProject,
            getProjects: getProjects,
            removeProject: removeProject
        };

        function projectUniqueId(prefix) {
            var lastProjectId;
            var projectIdNum;
            if(_.isArray(projects) && !_.isEmpty(projects)) {
                lastProjectId = _.last(projects)['id'];
                projectIdNum = parseInt(lastProjectId.match(/\d+$/g)[0], 10);
            }
            return projectIdNum ? prefix + (++projectIdNum) : prefix + 1;
        }

        function createProject(name) {
            if(!name) {
                return;
            }
            var project = {};
            project.id = projectUniqueId('project_');
            project.name = name;

            projects.push(project);
            todoerStorage.store(projects, _STORAGE_KEY);
        }

        function getProjects() {
            return projects;
        }

        function removeProject(projectId) {
            if(!projectId) {
                return;
            }
            _.remove(projects, function(p) {
                return p.id === projectId;
            });
            todoerStorage.store(projects, _STORAGE_KEY);
        }
    }]);
})();