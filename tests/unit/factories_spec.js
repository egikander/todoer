describe('Factories::', function() {
    beforeEach(function() {
        module('todoer');
        localStorage.clear();
    });

    describe('Projects factory', function() {
        var projectsFactory;

        beforeEach(inject(function(_projectsFactory_) {
            projectsFactory = _projectsFactory_;
        }));

        it('should be defined', function() {
            expect(projectsFactory).toBeDefined();
        });

        it('should be able to create project', function() {
            expect(projectsFactory.createProject).toBeDefined();
        });

        it('should create project', function() {
            projectsFactory.createProject('My project');
            expect(projectsFactory.getProjects().length).toBe(1);
            expect(projectsFactory.getProjects()[0].name).toBe('My project');
        });

        it('should not create project without project name', function() {
            expect(projectsFactory.getProjects().length).toBe(0);
            projectsFactory.createProject();
            expect(projectsFactory.getProjects().length).toBe(0);
        });

        it('should be able return projects', function() {
            expect(projectsFactory.getProjects).toBeDefined();
        });

        it('should return projects', function() {
            projectsFactory.createProject('My project #1');
            projectsFactory.createProject('My project #2');
            expect(projectsFactory.getProjects().length).toBe(2);
            expect(projectsFactory.getProjects()[0].name).toEqual('My project #1');
            expect(projectsFactory.getProjects()[1].name).toEqual('My project #2');
        });

        it('should be able remove project', function() {
            expect(projectsFactory.removeProject).toBeDefined();
        });

        it('should remove project by projectId', function() {
            projectsFactory.createProject('My project #1');
            projectsFactory.createProject('My project #2');
            expect(projectsFactory.getProjects().length).toBe(2);
            var projectId = projectsFactory.getProjects()[0].id;
            projectsFactory.removeProject(projectId);
            expect(projectsFactory.getProjects().length).toBe(1);
            expect(projectsFactory.getProjects()[0].name).toBe('My project #2');
        });

        it('should not remove project without projectId', function() {
            projectsFactory.createProject('My project');
            expect(projectsFactory.getProjects().length).toBe(1);
            projectsFactory.removeProject();
            expect(projectsFactory.getProjects().length).toBe(1);
        });

        it('should generate correct unique project id', function() {
            projectsFactory.createProject('My project #1');
            expect(projectsFactory.getProjects()[0].id).toEqual('project_1');
            projectsFactory.createProject('My project #2');
            expect(projectsFactory.getProjects()[1].id).toEqual('project_2');
        });
    });

    describe('Tasks factory', function() {
        var tasksFactory;
        var projectId;

        beforeEach(inject(function(_tasksFactory_, _projectsFactory_) {
            tasksFactory = _tasksFactory_;
            var projectsFactory = _projectsFactory_;
            projectsFactory.createProject('My project');
            projectId = projectsFactory.getProjects()[0].id;
        }));

        it('should be defined', function() {
            expect(tasksFactory).toBeDefined();
        });

        it('should be able to add task', function() {
            expect(tasksFactory.addTask).toBeDefined();
        });

        it('should not add task with empty project id', function() {
            projectId = '';
            tasksFactory.addTask(projectId, 'Task #1');
            expect(tasksFactory.getTasks().length).toBe(0);
        });

        it('should not add task with empty description', function() {
            var taskDescription = '';
            tasksFactory.addTask(projectId, taskDescription);
            expect(tasksFactory.getTasks().length).toBe(0);
        });

        it('should add task', function() {
            tasksFactory.addTask(projectId, 'Task #1');
            expect(tasksFactory.getTasks().length).toBe(1);
            expect(tasksFactory.getTasks()[0].description).toBe('Task #1');
        });

        it('should be able to return tasks', function() {
            expect(tasksFactory.getTasks).toBeDefined();
        });

        it('should return tasks', function() {
            expect(tasksFactory.getTasks().length).toBe(0);
            expect(tasksFactory.getTasks()).toEqual([]);
            tasksFactory.addTask(projectId, 'Task #1');
            expect(tasksFactory.getTasks().length).toBe(1);
            expect(tasksFactory.getTasks()[0].description).toBe('Task #1');
            tasksFactory.addTask(projectId, 'Task #2');
            expect(tasksFactory.getTasks().length).toBe(2);
            expect(tasksFactory.getTasks()[1].description).toBe('Task #2');
        });

        it('should be able to update task', function() {
            expect(tasksFactory.updateTask).toBeDefined();
        });

        it('should not update task without task data', function() {
            tasksFactory.addTask('Task #1');
            var taskBeforeUpdate = tasksFactory.getTasks()[0];
            tasksFactory.updateTask();
            expect(tasksFactory.getTasks()[0]).toEqual(taskBeforeUpdate);
        });

        it('should update task', function() {
            tasksFactory.addTask(projectId, 'Task #1');
            expect(tasksFactory.getTasks().length).toBe(1);
            expect(tasksFactory.getTasks()[0].description).toEqual('Task #1');
            var newTaskDescription = 'New Task #1';
            var taskId = tasksFactory.getTasks()[0].id;
            tasksFactory.updateTask({id: taskId, description: newTaskDescription});
            expect(tasksFactory.getTasks().length).toBe(1);
            expect(tasksFactory.getTasks()[0].description).toEqual(newTaskDescription);
        });

        it('should be able to remove task', function() {
            expect(tasksFactory.removeTask).toBeDefined();
        });

        it('should not remove task with empty id', function() {
            tasksFactory.addTask(projectId, 'Task #1');
            expect(tasksFactory.getTasks().length).toBe(1);
            var taskId = '';
            tasksFactory.removeTask(taskId);
            expect(tasksFactory.getTasks().length).toBe(1);
        });

        it('should remove task', function() {
            tasksFactory.addTask(projectId, 'Task #1');
            expect(tasksFactory.getTasks().length).toBe(1);
            var taskId = tasksFactory.getTasks()[0].id;
            tasksFactory.removeTask(taskId);
            expect(tasksFactory.getTasks().length).toBe(0);
        });

        it('should be able to remove tasks by project id', function() {
            expect(tasksFactory.removeTasks).toBeDefined();
        });

        it('should not remove tasks with empty project id', function() {
            tasksFactory.addTask(projectId, 'Task #1');
            tasksFactory.addTask(projectId, 'Task #2');
            expect(tasksFactory.getTasks().length).toBe(2);
            projectId = '';
            tasksFactory.removeTasks(projectId);
            expect(tasksFactory.getTasks().length).toBe(2);
        });

        it('should remove tasks by project id', function() {
            tasksFactory.addTask(projectId, 'Task #1');
            tasksFactory.addTask(projectId, 'Task #2');
            expect(tasksFactory.getTasks().length).toBe(2);
            tasksFactory.removeTasks(projectId);
            expect(tasksFactory.getTasks().length).toBe(0);
            expect(tasksFactory.getTasks()).toEqual([]);
        });

        it('should be able to make task done', function() {
            expect(tasksFactory.taskDone).toBeDefined();
        });

        it('should not make task done without task id', function() {
            tasksFactory.addTask(projectId, 'Task #1');
            expect(tasksFactory.getTasks()[0].done).toBe(false);
            var taskId = '';
            tasksFactory.taskDone(taskId);
            expect(tasksFactory.getTasks()[0].done).toBe(false);
        });

        it('should make task done', function() {
            tasksFactory.addTask(projectId, 'Task #1');
            expect(tasksFactory.getTasks()[0].done).toBe(false);
            var taskId = tasksFactory.getTasks()[0].id;
            tasksFactory.taskDone(taskId);
            expect(tasksFactory.getTasks()[0].done).toBe(true);
        });

        it('should generate correct unique task id', function() {
            tasksFactory.addTask(projectId, 'Task #1');
            expect(tasksFactory.getTasks()[0].id).toEqual('task_1');
            tasksFactory.addTask(projectId, 'Task #2');
            expect(tasksFactory.getTasks()[1].id).toEqual('task_2');
        });
    });

    describe('Todoer storage factory', function() {
        var storage;

        beforeEach(inject(function(_todoerStorage_) {
            storage = _todoerStorage_;
        }));

        it('should be defined', function() {
            expect(storage).toBeDefined();
        });

        it('should be able to store data', function() {
            expect(storage.store).toBeDefined();
        });

        it('should be able to load data', function() {
            expect(storage.load).toBeDefined();
        });

        it('should not store with empty data', function() {
            var data = null;
            var key = 'test';
            storage.store(data, key);
            expect(storage.load(key)).toBe(null);
        });

        it('should not store with empty key', function() {
            var data = {data: 'test data'};
            var key = '';
            storage.store(data, key);
            expect(storage.load(key)).toBe(null);
        });

        it('should store data', function() {
            var data = {data: 'test data'};
            var key = 'test';
            storage.store(data, key);
            expect(storage.load(key)).toEqual(data);
        });

        it('should not load data without key', function() {
            var data = {data: 'test data'};
            var key = 'test';
            storage.store(data, key);
            key = '';
            expect(storage.load(key)).toBe(null);
        });

        it('should load data', function() {
            var data = {data: 'test data'};
            var key = 'test';
            storage.store(data, key);
            expect(storage.load(key)).toEqual(data);
        });
    });
});