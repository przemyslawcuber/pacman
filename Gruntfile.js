module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      src:["Gruntfile.js", "src/*.js"]
    },
    watch: {
      scripts: {
	files: ['**/*.js'],
	tasks: ['jshint'],
	options: {
	  spawn: false,
	},
      },
    },
    uglify: {
      bar: {
	// uglify task "bar" target options and files go here.
	src: "src/script.js",
	dest: "src-min/script.js"
      },
    },
    htmlmin: {                                     // Task 
      dist: {                                      // Target 
	options: {                                 // Target options 
	  removeComments: true,
	  collapseWhitespace: true
	},
	files: {                                   // Dictionary of files 
	  'src-min/index.html': 'src/index.html'     // 'destination': 'source' 
	}
      },
    },
    cssmin: {
      options: {
	shorthandCompacting: false,
	roundingPrecision: -1
      },
      target: {
	files: {
	  'src-min/style.css': 'src/style.css'
	}
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Minify code
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['jshint']);

}; 
