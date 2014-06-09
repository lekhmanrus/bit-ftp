var child = require('child_process'),
    path = require('path');

module.exports = function(grunt) {
 
  grunt.registerTask('run-nw-gyp', function() {
   
    var done = this.async();
    var t = child.exec('nw-gyp --target=0.8.6 rebuild', {
      cwd: 'node_modules/ftpd/',
      env: process.env
    },
    function(error, stdout, stderr) {
      if(error)
        throw(undefined);
      done();
    });

    t.stderr.pipe(process.stderr);
    t.stdout.pipe(process.stdout);
   
  });

}