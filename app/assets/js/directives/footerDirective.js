(function() {
    'use strict';
    var app = angular.module('todoer');

    app.directive('footer', function() {
        return {
            restrict: 'E',
            templateUrl: 'assets/templates/footer.html',
        };
    });
})();