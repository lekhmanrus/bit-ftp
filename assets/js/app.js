'use strict';

angular

.module('bitFTPApp', [
  'ngRoute',
  'bitFTPApp.filters',
  'bitFTPApp.services',
  'bitFTPApp.directives',
  'bitFTPApp.controllers',
  'ngAnimate',
  'mgcrea.ngStrap',
  'ui-rangeSlider'
])

.config(['$routeProvider', '$modalProvider', function($routeProvider, $modalProvider) {

  $routeProvider
    .when('/log', {templateUrl: 'partials/log.html', controller: 'LogCtrl'})
    .when('/options', {templateUrl: 'partials/options.html', controller: 'OptionsCtrl'})
    .when('/users', {templateUrl: 'partials/users.html', controller: 'UsersCtrl'})
    .otherwise({redirectTo: '/log'});

  angular.extend($modalProvider.defaults, {
    animation: 'am-fade-and-scale',
    placement: 'center'
  });

}])

.run(['server', 'configurationManager', 'loading', function(server, cm, loading) {

  cm.loadConfiguration(function() {
    server.writeLog();
    loading.status = false;
  });

}]);