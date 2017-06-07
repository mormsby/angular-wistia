var app = angular.module("App", [ "ngRoute", "AngularWistia"]);

var appConstants  = angular.module('app.constants', []);

app.config([ "$routeProvider", function($routeProvider) {
    $routeProvider.when("/", {
        controller: "MainCtrl",
        templateUrl: "partials/main.html",
        page: {
            authorize: false
        }
    });
    $routeProvider.otherwise({
        redirectTo: "/"
    });
} ]);

app.controller("MainCtrl", [ "$scope", function($scope) {
    $scope.awPassword = CONST.API_PASSWORD;
} ]);
