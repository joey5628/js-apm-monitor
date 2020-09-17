const WebpackMerge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const webpackBaseConfig = require('./webpack.base');

module.exports = WebpackMerge.merge(webpackBaseConfig, {
    
    mode: 'production',
    devtool: false,

    optimization: {
        minimizer: [
            new UglifyJsPlugin()
        ],
        noEmitOnErrors: true
    },
})