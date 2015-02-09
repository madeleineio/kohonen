/**
 * Created by nmondon on 09/02/2015.
 */


var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: './web_modules/main.jsx',
    output: {
        path: './public/js',
        filename: 'bundle.js'
    },
    externals: {
        'jquery': 'jQuery',
        'lodash': '_',
        'd3': 'd3',
        'bluebird': 'P',
        'react': 'React'
    },
    resolve: {
        root: [
            path.resolve('node_modules'),
            path.resolve('web_modules'),
            path.resolve('sass')
        ],
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            // css and style loader
            {test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader'},
            { test: /\.woff$/,   loader: "url-loader?limit=10000&minetype=application/font-woff" },
            { test: /\.ttf$/,    loader: "file-loader" },
            { test: /\.eot$/,    loader: "file-loader" },
            { test: /\.svg$/,    loader: "file-loader" },
            // jsx loader
            { test: /\.jsx$/, loader: 'jsx-loader'}
        ]
    },
    devtool: 'source-map'
};