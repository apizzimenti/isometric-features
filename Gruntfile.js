module.exports = function (grunt) {
    'use strict';
    // Project configuration
    grunt.initConfig({
        
        app: {
            scripts: [
                "test/scripts/**/*.js"
            ],
            testStyles: [
                "test/styles/**/*.css"
            ]
        },
        
        // Metadata
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= pkg.license %> */\n',
        
        // Task configuration
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['dist/compiled/**/*.js'],
                dest: 'dist/isometric-features.js'
            }
        },
        
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/isometric-features.min.js'
            }
        },
        
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib_test: {
                files: '<%= jshint.lib_test.src %>',
                tasks: ['jshint:lib_test', 'nodeunit']
            }
        },
        
        babel: {
            options: {
                presets: ["es2015"]
            },
            
            dist: {
                files: [{
                    expand: true,
                    cwd: "lib/",
                    src: ["**/*.js"],
                    dest: "dist/compiled"
                }]
            }
        },
    
        jsdoc: {
            dist: {
                src: ["lib/**/*.js", "lib/README.md"],
                options: {
                    destination: "../isometric-features-docs/",
                    template: "node_modules/minami"
                }
            }
        },
        
        includeSource: {
            options: {
                basepath: "dist/",
                baseUrl: "",
                ordering: "",
                rename: function (dest, match, options) {
                    return "../" + match;
                }
            },
            app: {
                files: {
                    "test/index.html" : "test/index.html"
                }
            }
        },
        
        wiredep: {
            task: {
                src: ["test/index.html"]
            }
        },
        
        strictly: {
            options: {
                function: true,
                cwd: "lib/"
            },
            files: ["**/*.js"]
        }
    });

    // These plugins provide necessary tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks("grunt-include-source");
    grunt.loadNpmTasks("grunt-babel");
    grunt.loadNpmTasks("grunt-jsdoc");
    grunt.loadNpmTasks("grunt-wiredep");
    grunt.loadNpmTasks("strictly");

    // Default task
    grunt.registerTask('default', ["strictly", "jsdoc"]);
    grunt.registerTask("test", ["includeSource", "wiredep"]);
    grunt.registerTask("build", ["strictly", "babel", "concat", "uglify", "jsdoc"]);
};

