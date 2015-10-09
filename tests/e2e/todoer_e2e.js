var Todoer = function() {

    this.newProjectInput = element(by.model('projectsCtrl.newProjectName'));
    this.newTaskInput = element(by.model('projectCtrl.taskDescription'));
    this.completeTaskInput = element(by.css('.task')).element(by.css('.glyphicon-ok'));
    this.removeTaskInput = element(by.css('.task')).element(by.css('.glyphicon-remove-circle'));
    this.removeProjectInput = element(by.css('.del-project'));

    this.get = function() {
        browser.get('/');
    }

    this.createProject = function(projectName) {
        this.newProjectInput.sendKeys(projectName, protractor.Key.ENTER);
    };

    this.createTask = function(taskName) {
        this.newTaskInput.sendKeys(taskName, protractor.Key.ENTER);
    };

    this.taskCompleted = function() {
        this.completeTaskInput.click();
    };

    this.removeTask = function() {
        this.removeTaskInput.click();
    };

    this.removeProject = function() {
        this.removeProjectInput.click();
    };
};

describe('Todoer::', function() {
    var todoer = new Todoer();

    beforeEach(function() {
        browser.executeScript('window.confirm = function() { return true; };');
    });

    it('should load and display correct title', function() {
        todoer.get();
        expect(browser.getTitle()).toBe('TODOER');
    });

    describe('Create project', function() {
        it('should create project', function() {
            todoer.createProject('My project');
            var projects = element.all(by.css('.project'));
            expect(projects.count()).toBe(2);
            expect(projects.get(0).element(by.css('.project-head')).getText()).toEqual('My project');
        });
    });

    describe('Create task', function() {
        it('should create task', function() {
            todoer.createTask('My task');
            expect(element.all(by.css('.task')).count()).toBe(1);
            expect(element.all(by.css('.task')).getText()).toContain('My task');
        });
    });

    describe('Complete task', function() {
        it('should make task completed', function() {
            expect(element.all(by.css('.task-done')).count()).toBe(0);
            todoer.taskCompleted();
            expect(element.all(by.css('.task-done')).count()).toBe(1);
        });
    });

    describe('Remove task', function() {
        it('should remove task', function() {
            expect(element.all(by.css('.task')).count()).toBe(1);
            todoer.removeTask();
            expect(element.all(by.css('.task')).count()).toBe(0);
        });
    });

    describe('Remove project', function() {
        it('should remove project', function() {
            expect(element.all(by.css('.project')).count()).toBe(2);
            todoer.removeProject();
            expect(element.all(by.css('.project')).count()).toBe(1);
        });
    });
});