
module.exports = {

    entry: './src/index.ts',

    resolve: {
        extensions: ['.ts', '.js']
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }]
            },
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                loader: 'awesome-typescript-loader'
            }
        ]
    }

};