var App;
(function (App) {
    App.num = 0;
    angular.module('Wanker', ['Wanker.controllers']);
    angular.module('Wanker.controllers', []).controller('shellController', function ($scope) {
        $scope.message = "Hello World";
    });
})(App || (App = {}));
