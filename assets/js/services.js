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

  this.getClientsOnlineCount = function() {
    return ftpd.getClientsOnlineCount();
  };

  this.getUsersOnlineCount = function() {
    return ftpd.getUsersOnlineCount();
  };

}])

.value('log', [ ])

.service('users', ['$modal', 'ftpd', 'configurationManager', function($modal, ftpd, cm) {

  var ftpd = require('ftpd');

  this.users = [];
  this.editUserId = undefined;

  this.getUsersCount = function() {
    return ftpd.getUsersCount();
  };

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
    cm.setUsers(this.users);
    cm.saveConfiguration();
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
    cm.setUsers(this.users);
    cm.saveConfiguration();
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
    cm.setUsers(this.users);
    cm.saveConfiguration();
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

.service('options', ['$modal', 'ftpd', 'configurationManager', function($modal, ftpd, cm) {

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
    this.getOptions();
    cm.setOptions(this.options);
    cm.saveConfiguration();
    return this.options;
  };

}])

.service('configurationManager', ['$modal', 'ftpd', function($modal, ftpd) {

  var fs   = require('fs'),
      //path = './configuration.json';
      rpath = require('path'),
      path = rpath.dirname( process.execPath ) + ((process.platform === "win32") ? '\\' : '/') + 'configuration.json';

  this.configuration = { };

  this.setUsers = function(u) {
    this.configuration.users = angular.copy(u);
  };

  this.setOptions = function(o) {
    var u = [ ];
    if(this.configuration.users)
      u = this.configuration.users;
    this.configuration = o;
    this.setUsers(u);
  };

  this.saveConfiguration = function() {
    try {
      fs.writeFile(path, JSON.stringify(this.configuration, null, 2), function(err) {
        if(err)
          $modal({ title: err.name, content: err.message, show: true });
      });
    }
    catch(err) {
      $modal({ title: err.name, content: err.message, show: true });
    }
  };

  this.loadConfiguration = function(cb) {
    var self = this;
    try {
      if(fs.existsSync(path)) {
        fs.readFile(path, 'utf-8', function(err, contents) {
          if(err)
            $modal({ title: err.name, content: err.message, show: true });
          if(contents) {
            self.configuration = JSON.parse(contents);
            var c = self.configuration;
            if(c.dataPortRangeFrom !== undefined &&
               c.dataPortRangeTo !== undefined &&
               c.noLoginTimeout !== undefined &&
               c.noTransferTimeout !== undefined &&
               c.checkPassDelay !== undefined &&
               c.maxPasswordTries !== undefined &&
               c.listenPort !== undefined
              )
              ftpd.setOptions(c.dataPortRangeFrom, c.dataPortRangeTo, c.noLoginTimeout, c.noTransferTimeout, c.checkPassDelay, c.maxPasswordTries, c.listenPort);
            for(var i in c.users)
              ftpd.addUser(c.users[i].login, c.users[i].password, c.users[i].startDirectory, c.users[i].privileges, c.users[i].maxClient);
          }
          cb();
        });
      }
      else
        cb();
    }
    catch(err) {
      $modal({ title: err.name, content: err.message, show: true });
    }
  };

}])

.value('loading', { status: true });