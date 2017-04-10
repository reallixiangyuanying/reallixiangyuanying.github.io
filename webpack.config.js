var path = require('path');
var webpack = require('webpack');


module.exports = {
    entry: './myBlog.jsx',
    output: { path: `${__dirname}/doc/`, filename: 'bundle.js', publicPath: "/assets/" },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),

    ]
};