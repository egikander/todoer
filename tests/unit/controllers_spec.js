describe('Controllers ::', function() {
    beforeEach(function() {
        module('todoer');
        //clear localStorage
        localStorage.clear();
    });

    describe('Projects controller', function() {
        var projectsFactoryMock;
        var scope;
        var projectsCtrl;

        beforeEach(inject(function($controller, $rootScope, _projectsFactory_) {
            projectsFactoryMock = _projectsFactory_;
            scope = $rootScope.$new();
            projectsCtrl = $controller('projectsController', {
                $scope: scope,
                projectsFactory: projectsFactoryMock
            });
        }));

        it('should be defined', function() {
            expect(projectsCtrl).toBeDefined();
        });

        it('should have no projects on start', function() {
            expect(projectsCtrl.projects.length).toBe(0);
        });

        it('should able to create project', function() {
            expect(projectsCtrl.createProject).toBeDefined();
        });

        describe('create a new project', function() {
            afterEach(function() {
                projectsFactoryMock.projects = [];
            });

            it('should not add blank name projects', function() {
                var newProjectName = '';
                projectsCtrl.createProject(newProjectName);
                expect(projectsCtrl.projects.length).toBe(0);
            });

            it('should not add a project name consists of only whitespaces', function() {
                var newProjectName = '    ';
                projectsCtrl.createProject(newProjectName);
                expect(projectsCtrl.projects.length).toBe(0);
            });

            it('should trim whitespaces from new project name', function() {
                var newProjectName = '    My project    ';
                projectsCtrl.createProject(newProjectName);
                expect(projectsCtrl.projects.length).toBe(1);
                expect(projectsCtrl.projects[0].name).toEqual('My project');
            });
        });

    });

    describe('Project controller', function() {
        var scope;
        var projectCtrl;
        var projectsFactoryMock;
        var tasksFactoryMock;

        beforeEach(inject(function($controller, $rootScope, _projectsFactory_, _tasksFactory_) {
            projectsFactoryMock = _projectsFactory_;
            tasksFactoryMock = _tasksFactory_;
            projectsFactoryMock.createProject('My project');
            projectId = projectsFactoryMock.getProjects()[0].id;
            scope = $rootScope.$new();
            projectCtrl = $controller('projectController', {
                $scope: scope,
                projectsFactory: projectsFactoryMock,
                tasksFactory: tasksFactoryMock
            });
        }));

        it('should be defined', function() {
            expect(projectCtrl).toBeDefined();
        });

        it('should contain empty tasks list', function() {
            expect(projectCtrl.tasks.length).toBe(0);
        });

        it('should able to add task', function() {
            expect(projectCtrl.addTask).toBeDefined();
        });

        it('should able to filter tasks', function() {
            expect(projectCtrl.getTasks).toBeDefined();
        });

        it('should remove project', function() {
            expect(projectCtrl.removeProject).toBeDefined();
        });

        describe('Add new task', function() {
            it('should not add blank task name', function() {
                var newTaskName = '';
                projectCtrl.addTask(projectId, newTaskName);
                expect(projectCtrl.tasks.length).toBe(0);
            });

            it('should not add a task name consists of only whitespaces', function() {
                var newTaskName = '    ';
                projectCtrl.addTask(projectId, newTaskName);
                expect(projectCtrl.tasks.length).toBe(0);
            });

            it('should trim whitespaces from new task name', function() {
                var newTaskName = '    My task    ';
                projectCtrl.addTask(projectId, newTaskName);
                expect(projectCtrl.tasks.length).toBe(1);
                expect(projectCtrl.tasks[0].description).toEqual('My task');
            });

            it('should clear taskDescription after add', function() {
                projectCtrl.taskDescription = 'My task';
                projectCtrl.addTask(projectId, projectCtrl.taskDescription);
                expect(projectCtrl.tasks.length).toBe(1);
                expect(projectCtrl.taskDescription).toEqual('');
            });
        });

        describe('Filter tasks', function() {
            beforeEach(function() {
                projectCtrl.addTask(projectId, 'Task 1');
                projectCtrl.addTask(projectId, 'Task 2');
                projectsFactoryMock.createProject('My project #2');
                var newProjectId = projectsFactoryMock.getProjects()[1].id;
                projectCtrl.addTask(newProjectId, 'Task 3');
                projectCtrl.addTask(newProjectId, 'Task 4');
            });
            it('should filter task by projectId', function() {
                var tasks = [
                    {
                        id: 'task_1',
                        description: 'Task 1',
                        projectId: 'project_1',
                        done: false
                    },
                    {
                        id: 'task_2',
                        description: 'Task 2',
                        projectId: 'project_1',
                        done: false
                    }
                ];
                expect(projectCtrl.getTasks(projectId)).toEqual(tasks);
            });
        });

        describe('Remove project', function() {
            it('should remove project and tasks', function() {
                projectCtrl.removeProject(projectId);
                expect(projectCtrl.getTasks(projectId)).toEqual([]);
                expect(projectsFactoryMock.getProjects()).toEqual([]);
            });
        });
    });

    describe('Task controller', function() {
        var scope;
        var taskCtrl;
        var projectsFactoryMock
        var tasksFactoryMock;
        var project;
        var task;

        beforeEach(inject(function($rootScope, $controller, _tasksFactory_, _projectsFactory_) {
            scope = $rootScope.$new();
            tasksFactoryMock = _tasksFactory_;
            projectsFactoryMock = _projectsFactory_;
            projectsFactoryMock.createProject('My project');
            project = projectsFactoryMock.getProjects()[0];
            tasksFactoryMock.addTask(project.id, 'My task');
            task = tasksFactoryMock.getTasks()[0];
            taskCtrl = $controller('taskController', {
                $scope: scope,
                tasksFactory: tasksFactoryMock
            });
        }));

        it('should be defined', function() {
            expect(taskCtrl).toBeDefined();
        });

        it('should be isEditingTask false on start', function() {
            expect(taskCtrl.isEditingTask).toBe(false);
        });

        it('should be editingTask null on start', function() {
            expect(taskCtrl.editingTask).toBe(null);
        });

        describe('Edit task', function() {
            beforeEach(function() {
                taskCtrl.editTask(task);
            });

            it('should be isEditingTask true on start edit', function() {
                expect(taskCtrl.isEditingTask).toBe(true);
            });

            it('should be editingTask equal task', function() {
                expect(taskCtrl.editingTask).toEqual(task);
            });
        });

        describe('Update task', function() {
            beforeEach(function() {
                taskCtrl.editTask(task);
                taskCtrl.editingTask.description = 'My changed task';
                taskCtrl.updateTask();
            });

            it('should update task data', function() {
                expect(task.description).toEqual('My changed task');
            });

            it('should be isEditingTask false after update', function() {
                expect(taskCtrl.isEditingTask).toBe(false);
            });

            it('should be editingTask null after update', function() {
                expect(taskCtrl.editingTask).toEqual(null);
            });
        });

        describe('Task done', function() {

            it('should make task done', function() {
                expect(task.done).toBe(false);
                taskCtrl.taskDone(task);
                expect(task.done).toBe(true);
            });
        });

        describe('Remove task', function() {

            it('should remove task', function() {
                expect(tasksFactoryMock.getTasks()[0]).toEqual(task);
                taskCtrl.removeTask(task);
                expect(tasksFactoryMock.getTasks()).toEqual([]);
            });
        });
    });
});