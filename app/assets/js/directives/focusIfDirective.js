(function() {
    'use strict';
    var app = angular.module('todoer');

    app.directive('focusIf', function ($timeout) {
        return {
            restrict: 'A',
            link: {
                post: function postLink(scope, element, attrs) {
                    scope.$watch(attrs.focusIf, function (value) {
                        if (scope.$eval(attrs.focusIf)) {
                            $timeout(function () {
                                element[0].focus();
                            }, 100);
                        }
                    });
                }
            }
        };
    });
})();