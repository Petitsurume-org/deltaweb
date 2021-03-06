const webpack = require("webpack")

module.exports = {
    entry: "./src/client/index.js",
    output: {
        path: __dirname+"/dist",
        filename: "bundle.js"
    },
    plugins: [
        new webpack.ProvidePlugin({
            riot: "riot",
            apiCall: __dirname+"/src/client/api-call.js"
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    module: {
        loaders: [
            { test: /\.tag$/, exclude: /node_modules/, loader: 'riot-tag-loader', query: {
                type: "none",
                template: "pug",
                style: "less"
            }},
            { test: /\.css$/, loader: 'style-loader!css-loader' },
        ]
    }
}
