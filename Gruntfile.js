var path = require('path');

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadTasks('tasks');

  grunt.config.init({
    watch: {
      scripts: {
        files: [
          'node_modules/ftpd/**'
        ],
        exclude: [
          'node_modules/ftpd/build/**'
        ],
        tasks: [
          'run-nw-gyp'
        ],
        options: {
          spawn: true
        }
      }
    }
  });

  grunt.registerTask('default', [ 'run-nw-gyp', 'nodewebkit', 'watch' ]);
  
};