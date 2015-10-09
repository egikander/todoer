(function(){
    'use strict';

    var app = angular.module('todoer');

    app.directive('confirmRemove', ['$window', function($window) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var defaultMsg = 'Are you sure?';
                element.bind('click', function() {
                    var msg = attrs.confirmRemoveMsg || defaultMsg;
                    if($window.confirm(msg)) {
                        scope.$apply(attrs.confirmRemove);
                    }
                });
            }
        };
    }]);
})();