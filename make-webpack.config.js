/**
 * 基础配置文件
 */

var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var Clean = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var appConfig = {
    app: 'app',
    dist: 'build',
    viewDir: 'app/pages',
    pageDir: path.resolve('app/pages')
};

var excludeFromStats = [
    /node_modules[\\\/]/
];

function makeConf(options){
    options = options || {};
    var dev = options.dev !== undefined ? options.dev : true; // 默认是 开发阶段

    var entry = genEntries(dev);

    entry.vendor = ['jquery']; // 不需要打进入口文件的第三方包，这里指定了才会提取到 vendor 中

    var output = {
        path: path.resolve(__dirname, appConfig.dist),
        filename: "[name].js",
        publicPath: ''
    };
    var loaders = [
        {
            test: /\.tmpl\.jade$/,
            loader: 'jade'
        },
        {
            test: /\.html\.jade$/,
            loader: 'file-loader?name=[path][name]&context=' + appConfig.viewDir + '!jade-html'
        },
        {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract('style', 'css?sourceMap!sass') // css 分离出来单独引入
        }
    ];
    var plugins = [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'), // 第三方包打成 vendor.js
        new webpack.ProvidePlugin({ // 每个模块都会有 $，而且不需要 require("jquery") 了
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new ExtractTextPlugin('[name].css', {
            // 当allChunks指定为false时，css loader必须指定怎么处理
            // additional chunk所依赖的css，即指定`ExtractTextPlugin.extract()`
            // 第一个参数`notExtractLoader`，一般是使用style-loader
            allChunks: false // todo::???
        })
    ];
    var alias = {
        jquery: path.resolve(appConfig.app) + "/bower_components/jquery/dist/jquery.js", // 就可以 require('jquery') 而不用整个路径了
    };

    // 开发阶段
    if(dev){
        plugins = plugins.concat([
            new webpack.HotModuleReplacementPlugin()
        ]);
    }
    // build 阶段
    else{
        plugins = plugins.concat([
            new Clean([appConfig.dist]),
            new webpack.optimize.UglifyJsPlugin()
        ]);
    }

    return {
        entry: entry,
        output: output,
        module: {
            loaders: loaders
        },
        plugins: plugins,
        resolve: {
            alias: alias
        },
        devtool: options.devtool,
        debug: options.debug,
        devServer: { // 开发配置
            stats: { // 控制台
                cached: false,
                exclude: excludeFromStats,
                colors: true
                // modules: true,
                // reasons: true
            },
            // hot: true, // 去掉之后，修改 html.jade 才会刷新
            historyApiFallback: true, // todo::???
            inline: true
        },
        progress: true
    };
}

function genEntries(dev) {
    var names = getAllFiles(appConfig.pageDir);
    var map = {};

    names.forEach(function(name) {
        var m = name.match(/(.+)\.js$/);
        var entry = m ? m[1] : '';
        var entryPath = entry ? path.resolve(appConfig.pageDir + '/' + name) : '';

        if(entry){
            if(dev){
                // 开发阶段，hot-mode 需要
                // https://github.com/webpack/webpack/issues/418
                map[entry] = ['webpack-dev-server/client?http://localhost:8080','webpack/hot/only-dev-server',entryPath];
            }else{
                map[entry] = entryPath;
            }
        }
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

module.exports = makeConf;
