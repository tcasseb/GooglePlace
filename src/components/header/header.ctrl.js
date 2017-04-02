'use strict';
angular
    .module('app.core')
    .controller('HeaderController', function($scope, PageValues) {
        //Setup the view model object
        var vm = this;
        vm.data = PageValues;
    });