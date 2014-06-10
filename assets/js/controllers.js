'use strict';

angular.module('bitFTPApp.controllers', [])

.controller('MainCtrl', ['$scope', '$location', '$route', '$modal', 'server', function($scope, $location, $route, $modal, server) {

  $scope.running = server.isRunning();
  $scope.page = null;

  $scope.$on('$routeChangeSuccess', function() {
    $scope.page = $location.path();
  });

  $scope.start = function() {
    $scope.running = server.start();
  };

  $scope.stop = function() {
    $scope.running = server.stop();
  };

  $scope.showModalAbout = function() {
    $modal({template: 'partials/modal/about.html', show: true});
  };

}])

.controller('LogCtrl', ['$scope', '$timeout', 'log', function($scope, $timeout, log) {

  var entriesRefresh = function() {
    $timeout(function() {
      $scope.entries = log;
      entriesRefresh();
    }, 10);
  };

  entriesRefresh();

}])

.controller('UsersCtrl', ['$scope', '$modal', '$timeout', 'users', function($scope, $modal, $timeout, users) {
 
  var initNewUser = function() {
    $scope.newUser = {
      anonymous: false,
      login: '',
      password: '',
      startDirectory: '',
      maxNumberOfClients: 0,
      privileges: {
        r: false,
        w: false,
        l: false,
        d: false,
        c: false,
        x: false
      }
    };
  };


  $scope.getUser = function(id) {
    if(id === undefined)
      return;
    var eu = users.getUser(id);
    $timeout(function() {
      $scope.editUserId = -1;
    });
    $timeout(function() {
      $scope.editUserId = users.editUserId;
    });
    $scope.editingUser = {
      anonymous: false,
      login: eu.login,
      password: eu.password,
      startDirectory: eu.startDirectory,
      maxNumberOfClients: eu.maxClient,
      privileges: {
        r: false,
        w: false,
        l: false,
        d: false,
        c: false,
        x: false
      }
    };
    if(eu.login == "anonymous" && eu.password == "")
      $scope.editingUser.anonymous = true;
    var priv = eu.privileges.split("");
    if(priv.indexOf('r') !== -1)
      $scope.editingUser.privileges.r = true;
    if(priv.indexOf('w') !== -1)
      $scope.editingUser.privileges.w = true;
    if(priv.indexOf('l') !== -1)
      $scope.editingUser.privileges.l = true;
    if(priv.indexOf('d') !== -1)
      $scope.editingUser.privileges.d = true;
    if(priv.indexOf('c') !== -1)
      $scope.editingUser.privileges.c = true;
    if(priv.indexOf('x') !== -1)
      $scope.editingUser.privileges.x = true;
  }

  $scope.editUserId = users.getEditUserId();
  $scope.getUser($scope.editUserId);
  $scope.users = users.getUsers();
  $scope.removeId = undefined;
  initNewUser();

  $scope.removeUser = function(id) {
    if(id == undefined)
      id = $scope.removeId;
    if(users.removeUser(id)) {
      $scope.users = users.users;
      $scope.editUserId = users.editUserId;
      $scope.getUser($scope.editUserId);
    }
    else
      $modal({ title: 'Error', content: 'Error removing a user', show: true });
  };

  $scope.showModalRemoveUser = function(id) {
    $scope.removeId = id;
    $modal({ scope: $scope, template: 'partials/modal/removeUser.html', show: true });
  };

  $scope.setNewAnonymous = function() {
    $scope.newUser.login = "anonymous";
    $scope.newUser.password = "";
  };

  $scope.setEditingAnonymous = function() {
    $scope.editingUser.login = "anonymous";
    $scope.editingUser.password = "";
  };

  $scope.addUser = function() {
    if($scope.editUserId === undefined) {
      if(this.users.some(function(e) { return e.login == $scope.newUser.login; })) {
        $modal({title: 'Error', content: 'Another user already exists with the same login.', show: true});
        return;
      }
      if(!users.checkData($scope.newUser.anonymous, $scope.newUser.login, $scope.newUser.password, $scope.newUser.startDirectory))
        return;
      if($scope.newUser.anonymous) {
        $scope.newUser.login = "anonymous";
        $scope.newUser.password = "";
      }
      var privileges = '';
      if($scope.newUser.privileges.r)
        privileges += 'r';
      if($scope.newUser.privileges.w)
        privileges += 'w';
      if($scope.newUser.privileges.l)
        privileges += 'l';
      if($scope.newUser.privileges.d)
        privileges += 'd';
      if($scope.newUser.privileges.c)
        privileges += 'c';
      if($scope.newUser.privileges.x)
        privileges += 'x';
      if(users.addUser($scope.newUser.login, $scope.newUser.password, $scope.newUser.startDirectory, privileges, $scope.newUser.maxNumberOfClients)) {
        $scope.users = users.users;
        $scope.getUser(users.editUserId);
        initNewUser();
      }
      else
        $modal({title: 'Adding a user', content: 'Error! Something went wrong.', show: true});
    }
    else
      $scope.editUserId = undefined;
  };

  $scope.editUser = function() {
    if(this.users.some(function(e) { return e.login == $scope.editingUser.login && e.id != $scope.editUserId; })) {
      $modal({title: 'Error', content: 'Another user already exists with the same login.', show: true});
      return false;
    }
    if(!users.checkData($scope.editingUser.anonymous, $scope.editingUser.login, $scope.editingUser.password, $scope.editingUser.startDirectory))
      return;
    if($scope.editingUser.anonymous) {
      $scope.editingUser.login = "anonymous";
      $scope.editingUser.password = "";
    }
    var privileges = '';
    if($scope.editingUser.privileges.r)
      privileges += 'r';
    if($scope.editingUser.privileges.w)
      privileges += 'w';
    if($scope.editingUser.privileges.l)
      privileges += 'l';
    if($scope.editingUser.privileges.d)
      privileges += 'd';
    if($scope.editingUser.privileges.c)
      privileges += 'c';
    if($scope.editingUser.privileges.x)
      privileges += 'x';
    if(users.editUser($scope.editUserId, $scope.editingUser.login, $scope.editingUser.password, $scope.editingUser.startDirectory, privileges, $scope.editingUser.maxNumberOfClients)) {
      $scope.users = users.users;
    }
    else
      $modal({title: 'Editing a user', content: 'Error! Something went wrong.', show: true});
  };

}])

.controller('OptionsCtrl', ['$scope', function($scope) {

  $scope.options = { dataPortRange: { from: 100, to: 999 } };

  $scope.saveOptions = function() {
    alert(1);
  };

}]);