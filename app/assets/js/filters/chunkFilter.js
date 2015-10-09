(function() {
    'use strict';
    var app = angular.module('todoer');
    app.filter('chunk', [function() {
        return function(arrLength) {
            if(arrLength) {
                arrLength = Math.ceil(arrLength);
                var arr = new Array(arrLength);
                for(var i=0; i < arrLength; i++) {
                    arr[i] = i;
                }
                return arr;
            }
        };
    }]);
})();