const path = require('path');
const webpack = require('webpack')
const WebpackMerge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base');

module.exports = WebpackMerge.merge(webpackBaseConfig, {

    output: {
        path: path.join(__dirname, '..', 'example/public/'),
        libraryTarget: 'umd',
        library: 'apmMonitor',
        filename: 'js-apm-monitor.dev.js',
    },

    mode: 'development',
    devtool: '#inline-source-map'

})