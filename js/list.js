var app = angular.module("myApp", []);
app.controller("studentCtrl", function ($scope, $http) {
    $scope.list_student = [];
    $http.get('db/Students.js').then(function (reponse) {
        $scope.list_student = reponse.data;
    })
});