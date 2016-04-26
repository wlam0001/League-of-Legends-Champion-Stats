var app = angular.module('champions', []);

app.controller('ChampionsController', ['$http', "$scope", function($http, $scope) {
    this.senators = [];
    var _this = this;
    $scope.selected = {};

    $http.get('/js/champion.json')
        .success(function(data) {
            console.log(data);
            _this.champions = data;
        })
        .error(function(msg) {
            console.log("This request failed.\n" + msg);
        });


}]);
