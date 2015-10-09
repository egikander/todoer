(function() {
    'use strict';

    var app = angular.module('todoer');

    app.factory('todoerStorage', ['$window', function($window) {

        var storage = $window.localStorage;

        return {
            store: store,
            load: load
        };

        function store(data, key) {
            if(data && key) {
                storage.setItem(key, angular.toJson(data));
            }
        }

        function load(key) {
            if(!key.length) {
                return null;
            }
            var data = storage.getItem(key);
            return JSON.parse(data);
        }
    }]);
})();