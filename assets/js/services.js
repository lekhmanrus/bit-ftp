'use strict';

angular.module('bitFTPApp.services', [])

.value('version', '0.0.1')

.constant('ftpd', require('ftpd'))

.service('server', ['$modal', 'ftpd', 'log', function($modal, ftpd, log) {

  this.isRunning = false;
  this.entries   = [];

  this.isRunning = function() {
    try {
      this.isRunning = ftpd.isRunning();
    }
    catch(err) {
      $modal({ title: err.name, content: err.message, show: true });
    }
    return this.isRunning;
  };

  this.start = function() {
    try {
      ftpd.start();
      this.isRunning = ftpd.isRunning();
    }
    catch(err) {
      $modal({ title: err.name, content: err.message, show: true });
    }
    return this.isRunning;
  };

  this.stop = function() {
    try {
      ftpd.stop();
      this.isRunning = ftpd.isRunning();
    }
    catch(err) {
      $modal({ title: err.name, content: err.message, show: true });
    }
    return this.isRunning;
  };

  this.writeLog = function() {
    var sortHandler = function(a, b) { return b.id - a.id; }
    ftpd.setCallback(function(message, type) {
      log.push({ id: log.length + 1, date: new Date().getTime(), message: message, type: type });
      log.sort(sortHandler);
    });
  };

}])

.value('log', [ ])

.service('users', ['$modal', 'ftpd', function($modal, ftpd) {

  var ftpd = require('ftpd');

  this.users = [];
  this.editUserId = undefined;

  this.getUsers = function() {
    try {
      this.users = ftpd.getUsers();
    }
    catch(err) {
      $modal({title: err.name, content: err.message, show: true});
    }
    return this.users;
  };

  this.getUser = function(id) {
    this.setEditUserId(id);
    var u;
    try {
      u = ftpd.getUser(id);
    }
    catch(err) {
      $modal({ title: err.name, content: err.message, show: true });
    }
    return u;
  };

  this.removeUser = function(id) {
    try {
      if(!ftpd.removeUser(id))
        return false;
    }
    catch(err) {
      $modal({ title: err.name, content: err.message, show: true });
    }
    this.getUsers();
    if(this.editUserId == id)
      this.setEditUserId();
    return true;
  };

  this.addUser = function(login, password, startDirectory, privileges, maxNumberOfClients) {
    try {
      if(!ftpd.addUser(login, password, startDirectory, privileges, maxNumberOfClients))
        return false;
    }
    catch(err) {
      $modal({ title: err.name, content: err.message, show: true });
    }
    this.getUsers();
    this.setEditUserId(this.users[this.users.length - 1].id);
    return true;
  };

  this.editUser = function(id, login, password, startDirectory, privileges, maxNumberOfClients) {
    try {
      if(!ftpd.setUserLogin(id, login) ||
       !ftpd.setUserPassword(id, password) ||
       !ftpd.setUserStartDirectory(id, startDirectory) ||
       !ftpd.setUserPrivileges(id, privileges) ||
       !ftpd.setUserMaxNumberOfClient(id, maxNumberOfClients))
        return false;
    }
    catch(err) {
      $modal({ title: err.name, content: err.message, show: true });
    }
    this.getUsers();
    return true;
  };

  this.getEditUserId = function() {
    if(this.editUserId === undefined)
      this.setEditUserId();
    return this.editUserId;
  };

  this.setEditUserId = function(id) {
    this.editUserId = id || ((this.users.length > 0) ? this.users[0].id : undefined);
    return true;
  };

  this.checkData = function(anonymous, login, password, startDirectory) {
    if(!anonymous && !login) {
      $modal({ title: 'Error', content: 'Input user login, please.', show: true });
      return false;
    }
    if(!anonymous && login.length > 16) {
      $modal({ title: 'Error', content: 'User login is too long. It max length is 16 characters.', show: true });
      return false;
    }
    if(!anonymous && !password) {
      $modal({ title: 'Error', content: 'Input user password, please.', show: true });
      return false;
    }
    if(!anonymous && password.length > 16) {
      $modal({ title: 'Error', content: 'User password is too long. It max length is 16 characters.', show: true });
      return false;
    }
    if(!startDirectory) {
      $modal({ title: 'Error', content: 'Choose user start directory, please.', show: true });
      return false;
    }
    return true;
  };

}])

.service('options', ['$modal', 'ftpd', function($modal, ftpd) {

  this.options = { };

  this.getOptions = function() {
    try {
      this.options = ftpd.getOptions();
    }
    catch(err) {
      $modal({ title: err.name, content: err.message, show: true });
    }
    return this.options;
  };

  this.setOptions = function(dataPortRangeFrom, dataPortRangeTo, noLoginTimeout, noTransferTimeout, checkPassDelay, maxPasswordTries, listenPort) {
    try {
      ftpd.setOptions(dataPortRangeFrom, dataPortRangeTo, noLoginTimeout, noTransferTimeout, checkPassDelay, maxPasswordTries, listenPort);
    }
    catch(err) {
      $modal({ title: err.name, content: err.message, show: true });
    }
    return this.getOptions();
  };

}]);