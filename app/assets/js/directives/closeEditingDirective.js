(function() {
    'use strict';

    var KEYS = {
        ESCAPE: 27
    };
    var app = angular.module('todoer');

    app.directive('closeEditing', ['$window', function($window) {
        var _ = $window._;
        return {
            restrict: 'A',
            scope: {
                isEditing: '='
            },
            link: function(scope, element, attrs) {
                element.on('keyup blur', function(e) {
                    if(_.isEqual(e.keyCode, KEYS.ESCAPE) || e.type === 'blur') {
                        scope.isEditing = false;
                        scope.$apply();
                    }
                });
            }
        };
    }]);
})();