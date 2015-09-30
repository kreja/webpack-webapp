var path = require('path');
var fs = require('fs');
var webpack = require('webpack');


var appConfig = {
    app: 'app',
    dist: 'build',
    viewDir: 'views',
    pageDir: path.resolve('app/pages')
};

module.exports = function(grunt) {

  var sassStyle = 'expanded';
  var entries = genEntries();

  grunt.initConfig({
    yeoman: appConfig,
    pkg: grunt.file.readJSON('package.json'),
    jade: {
      compile: {
        options: {
          pretty: true,
          data: {
            debug: false
          }
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.viewDir %>',
          src: "*.jade",
          dest: '<%= yeoman.dist %>',
          ext: '.html'
        }]
      }
    },
    sass: {
      output : {
        options: {
          style: sassStyle
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.pageDir %>',
          src: "**/*.scss",
          dest: '<%= yeoman.dist %>',
          ext: '.css'
        }]
      }
    },
    postcss: {
        options: {
          map: true,
          cascade: true,
          pretty: true,
          expand: true,
          processors: [
            require('pixrem')(),
            require('autoprefixer-core')({browsers: 'last 2 versions'}),
            require('cssnano')()
          ]
        },
        dist: {
            files: [{
                expand: true,
                flatten: false,
                src: '<%= yeoman.dist %>/**/*.css'
            }]
        }
    },
    jshint: {
      all: [
        '<%= yeoman.pageDir %>/**/*.js',
        '<%= yeoman.app %>/mods/*.js'
      ]
    },
    /**
     * 打包 js
     */
    webpack: {
      js: {
        // webpack options
        entry: entries,
        output: {
            path: "<%= yeoman.dist %>",
            filename: "[name].js",
            publicPath: ''
        },

        stats: {
            // Configure the console output
            colors: false,
            modules: true,
            reasons: true
        },
        // stats: false disables the stats output

        storeStatsTo: "xyz", // writes the status to a variable named xyz
        // you may use it later in grunt i.e. <%= xyz.hash %>

        progress: false, // Don't show progress
        // Defaults to true

        failOnError: false, // don't report error to grunt if webpack find errors
        // Use this if webpack errors are tolerable and grunt should continue

        watch: true, // use webpacks watcher
        // You need to keep the grunt process alive

        keepalive: false, // don't finish the grunt task
        // Use this in combination with the watch option

        inline: true, // embed the webpack-dev-server runtime into the bundle
        // Defaults to false

        // hot: true, // adds the HotModuleReplacementPlugin and switch the server to hot mode
        // Use this in combination with the inline option

        devtool: '#source-map',
        plugins: [
            new webpack.optimize.UglifyJsPlugin()
        ]
      }
    },
    clean: ["<%= yeoman.dist %>"],
    watch: {
      scripts: {
        files: ['<%= yeoman.app %>/**/*.js'],
        tasks: ['jshint']
      },
      jade: {
        files: ['<%= yeoman.viewDir %>/*.jade'],
        tasks: ['jade']
      },
      sass: {
        files: ['<%= yeoman.pageDir %>/**/*.scss'],
        tasks: ['sass']
      },
      livereload: {
          options: {
              livereload: '<%= connect.options.livereload %>'
          },
          files: [
              '<%= yeoman.viewDir %>/*.jade',
              '<%= yeoman.pageDir %>/**/*.scss',
              '<%= yeoman.pageDir %>/**/*.js',
              '<%= yeoman.app %>/mods/*.js'
          ]
      }
    },
    connect: {
      options: {
          port: 9000,
          // open: true,
          livereload: 35729,
          // Change this to '0.0.0.0' to access the server from outside
          hostname: 'localhost',
          base: '<%= yeoman.dist %>'
      },
      server: {
        options: {
            open: true,
            middleware: function(connect) {
                return [
                    connect.static('build'),
                    // connect.static('src'),
                    connect().use(
                        '/bower_components',
                        connect.static('./app/bower_components') //组件加载到访问路径
                    )
                ];
            }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('serve',['clean','jade','sass','postcss','jshint','webpack','connect','watch']);
  grunt.registerTask('default');

};

function genEntries() {
    var names = getAllFiles(appConfig.pageDir);
    var map = {};

    names.forEach(function(name) {
        var m = name.match(/(.+)\.js$/);
        var entry = m ? m[1] : '';
        var entryPath = entry ? path.resolve(appConfig.pageDir + '/' + name) : '';

        if(entry) map[entry] = entryPath;
    });

    return map;
}

function getAllFiles(root){
    var res = [] , files = fs.readdirSync(root);

    files.forEach(function(file){
        var pathname = path.resolve(root+'/'+file), stat = fs.lstatSync(pathname);

        if (!stat.isDirectory()){
            res.push(pathname.replace(appConfig.pageDir+'/',''));
        } else {
            res = res.concat(getAllFiles(pathname));
        }
    });

    return res;
}
