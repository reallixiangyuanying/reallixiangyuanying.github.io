var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './my-blog.jsx',
    output: { path: __dirname, filename: 'bundle.js', publicPath: "/assets/" },
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
};