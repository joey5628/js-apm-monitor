const path = require('path');
const WebpackMerge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const webpackBaseConfig = require('./webpack.base');

module.exports = WebpackMerge.merge(webpackBaseConfig, {
    
    output: {
        path: path.join(__dirname, '..', 'lib/'),
        libraryTarget: 'umd',
        library: 'apmMonitor',
        filename: 'js-apm-monitor.js',
    },

    mode: 'production',
    devtool: false,
    

    optimization: {
        minimizer: [
            new UglifyJsPlugin()
        ],
        noEmitOnErrors: true
    },
})