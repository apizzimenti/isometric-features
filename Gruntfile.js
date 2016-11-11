/**
 * Created by apizzimenti on 10/19/16.
 */
module.exports = function (grunt) {
    'use strict';
    // Project configuration
    grunt.initConfig({

        app: {
            scripts: [
                "lib/**/*.js",
                "test/scripts/**/*.js"
            ],
            styles: [
                "lib/styles/**/*.css"
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

        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'lib/styles/',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist/',
                    ext: '.min.css'
                }]
            }
        }
    });

    // These plugins provide necessary tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks("grunt-include-source");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-wiredep");

    // Default task
    grunt.registerTask('default', ["wiredep", "includeSource", "concat"]);
};
