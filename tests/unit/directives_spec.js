describe('Directives::', function() {
    beforeEach(function() {
        module('todoer');
        localStorage.clear();
    });

    describe('Header directive', function() {
        var scope;
        var elem;

        beforeEach(inject(function($rootScope, $compile) {
            scope = $rootScope.$new();
            elem = angular.element('<header></header>');
            $compile(elem)(scope);
            scope.$digest();
        }));

        it('Replaces the element with the header content', function() {
            var divs = elem.find('div');
            expect(divs.eq(0).hasClass('navbar')).toBe(true);
            expect(divs.eq(2).hasClass('navbar-header')).toBe(true);
            var link = elem.find('a');
            expect(link.hasClass('navbar-brand')).toBe(true);
        });

        it('should behave correct title text', function() {
            var link = elem.find('a');
            expect(link.text()).toEqual('TODOER');
        });

        it('should behave correct link address', function() {
            var link = elem.find('a');
            expect(link.attr('href')).toEqual('/');
        });
    });

    describe('Footer directive', function() {
        var scope;
        var elem;

        beforeEach(inject(function($rootScope, $compile) {
            scope = $rootScope.$new();
            elem = angular.element('<footer></footer>');
            $compile(elem)(scope);
            scope.$digest();
        }));

        it('Replaces the element with the footer content', function() {
            expect($(elem).find('#footer').length).toBe(1);
            expect($(elem).find('.row').length).toBe(1);
            expect(elem.find('h4').length).toBe(1);
            expect(elem.find('h4').text()).toContain('Copyright');
            expect(elem.find('h4').text()).toContain('Todoer');
        });
    });

    describe('Todoer directive', function() {
        var scope;
        var elem;

        beforeEach(inject(function($rootScope, $compile, $controller, _projectsFactory_) {
            var projectsFactoryMock = _projectsFactory_;
            scope = $rootScope.$new();
            elem = angular.element('<todoer></todoer>');
            var projectsCtrl = $controller('projectsController', {
                $scope: $rootScope.$new(),
                projectsFactory: projectsFactoryMock
            });
            projectsFactoryMock.createProject('My project #1');
            projectsFactoryMock.createProject('My project #2');
            projectsFactoryMock.createProject('My project #3');
            projectsFactoryMock.createProject('My project #4');
            scope.ngController = projectsCtrl;
            $compile(elem)(scope);
            scope.$digest();
        }));

        it('should render projects', function() {
            expect($(elem).find('.project:not(.new-project)').length).toBe(4);
            expect($(elem)
                .find('.project:not(.new-project):first')
                .find('.project-head')
                .text()
                .trim()
            ).toBe('My project #1');
            expect($(elem)
                .find('.project:not(.new-project):last')
                .find('.project-head')
                .text()
                .trim()
            ).toBe('My project #4');
        });

        it('should render three projects in a row', function() {
            expect($(elem)
                .find('.row:first')
                .find('project')
                .length
            ).toBe(3);
        });

        it('should contain new project widget', function() {
            expect($(elem).find('.new-project').length).toBe(1);
            expect($(elem)
                .find('.new-project')
                .find('.project-head')
                .text()
                .trim()
            ).toBe('Create project');
        });
    });

    describe('Project directive', function() {
        var scope;
        var elem;

        beforeEach(inject(function($rootScope, $compile, $controller, _projectsFactory_, _tasksFactory_) {
            var projectsFactoryMock = _projectsFactory_;
            var tasksFactoryMock = _tasksFactory_;

            scope = $rootScope.$new();
            var projectCtrl = $controller('projectController', {
                $scope: $rootScope.$new(),
                projectsFactory: projectsFactoryMock,
                tasksFactory: tasksFactoryMock
            });

            elem = angular.element('<project></project>');
            scope.ngController = projectCtrl;
            $compile(elem)(scope);
            scope.$apply();
        }));

        it('should render project widget', function() {
            expect($(elem).find('.project').length).toBe(1);
            expect($(elem).find('.project-head').length).toBe(1);
            expect($(elem).find('.tasks').length).toBe(1);
        });

        it('should contain add task button', function() {
            expect($(elem).find('button').length).toBe(1);
            expect($(elem).find('button').text()).toBe('Add task');
        });

        it('should contain form for add new task', function() {
            expect($(elem).find('form').length).toBe(1);
            expect($(elem).find('form').find('input[type=text]').length).toBe(1);
            expect($(elem).find('form').find('button[type=submit]').length).toBe(1);
            expect($(elem).find('form').find('button[type=submit]').text().trim()).toBe('Add task');
        });
    });

    describe('Create project directive', function() {
        var scope;
        var elem;

        beforeEach(inject(function($rootScope, $compile) {
            scope = $rootScope.$new();
            elem = angular.element('<create-project></create-project>');
            $compile(elem)(scope);
            scope.$digest();
        }));

        it('should render new project widget', function() {
            expect($(elem).find('.new-project').length).toBe(1);
            expect($(elem).find('.project-head').text().trim()).toBe('Create project');
        });

        it('should contain form for add new project', function() {
            expect($(elem).find('form').length).toBe(1);
            expect($(elem).find('form').find('input[type=text]').length).toBe(1);
            expect($(elem).find('form').find('button[type=submit]').length).toBe(1);
            expect($(elem).find('form').find('button[type=submit]').text().trim()).toBe('Create');
        });
    });

    describe('Close editing directive', function() {
        var scope;
        var elem;

        beforeEach(inject(function($rootScope, $compile) {
            scope = $rootScope.$new();
            elem = angular.element('<input type="text" close-editing is-editing="isEditingTask">');
            scope.isEditingTask = true;
            $compile(elem)(scope);
            scope.$digest();
        }));

        it('should close task editing on blur', function() {
            expect(scope.isEditingTask).toBeTruthy();
            elem.triggerHandler('blur');
            expect(scope.isEditingTask).toBeFalsy();
        });

        it('should close task editing on ESC keyup', function() {
            expect(scope.isEditingTask).toBeTruthy();
            var e = $.Event('keyup', {keyCode: 27});
            $(elem).trigger(e);
            expect(scope.isEditingTask).toBeFalsy();
        });

        it('should do nothing on any key', function() {
            expect(scope.isEditingTask).toBeTruthy();
            var e = $.Event('keyup', {keyCode: 33});
            $(elem).trigger(e);
            expect(scope.isEditingTask).toBeTruthy();
        });
    });

    describe('Confirm remove directive', function() {
        var scope;
        var elem;

        beforeEach(inject(function($rootScope, $compile) {
            scope = $rootScope.$new();
            elem = angular.element('<span confirm-remove="removed = true"></span>');
            scope.removed = false;
            $compile(elem)(scope);
            scope.$digest();
        }));

        it('should remove if confirm is true', function() {
            spyOn(window, 'confirm').and.callFake(function() {
                return true;
            });
            $(elem).trigger('click');
            expect(scope.removed).toBeDefined();
            expect(scope.removed).toBeTruthy();
        });

        it('should not remove if confirm is false', function() {
            spyOn(window, 'confirm').and.callFake(function() {
                return false;
            });
            $(elem).trigger('click');
            expect(scope.removed).toBeDefined();
            expect(scope.removed).toBeFalsy();
        });
    });

    describe('Focus if directive', function() {
        var scope;
        var elem;
        var timeout;
        var browser;

        beforeEach(inject(function($rootScope, $compile, $timeout, $browser) {
            timeout = $timeout;
            browser = $browser;
            scope = $rootScope.$new();
            elem = angular.element('<input type="text" focus-if="focused">');
            scope.focused = false;
            $compile(elem)(scope);
            scope.$digest();
        }));

        it('should set focus on timeout', function() {
            spyOn(elem[0], 'focus');
            expect(browser.deferredFns.length).toBe(0);
            scope.$apply(function() {
                scope.focused = true;
            });
            expect(browser.deferredFns.length).toBe(1);
            timeout.flush();
            expect(elem[0].focus).toHaveBeenCalled();
        });

        it('should not set focus if expression false', function() {
            spyOn(elem[0], 'focus');
            expect(browser.deferredFns.length).toBe(0);
            scope.$apply(function() {
                scope.focused = false;
            });
            expect(browser.deferredFns.length).toBe(0);
            expect(elem[0].focus).not.toHaveBeenCalled();
        });
    });
});