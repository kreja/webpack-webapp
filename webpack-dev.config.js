/**
 * dev 开发配置文件
 */
'use strict';

module.exports = require('./make-webpack.config')({
    dev: true,
    devtool: 'source-map',
    debug: true
});
