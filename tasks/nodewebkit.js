var child = require('child_process'),
    path  = require('path');

module.exports = function(grunt) {
  
  var nw;
  
  grunt.registerTask('nodewebkit', function() {
    if(nw) {
      nw.kill();
    }
    
    if(process.platform === "win32")
      nw = child.spawn(path.resolve('node_modules', 'nodewebkit', 'nodewebkit', 'nw'), ['.']);
    else
      nw = child.exec('sudo ' + path.resolve('node_modules', 'nodewebkit', 'nodewebkit', 'nw') + ' .');
    
    nw.stderr.pipe(process.stderr);
    nw.stdout.pipe(process.stdout);
    
    /*var done = this.async();
    nw.on('exit', function() {
      done();
    });*/
    
  });
  
  process.on('exit', function() {
    if(nw) {
      nw.kill();
    }
  });
  
}