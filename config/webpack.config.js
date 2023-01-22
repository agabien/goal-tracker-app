const path = require('path');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    entry: {
        main: './src/index.ts',
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, '../', 'dist')
    },
    devServer: {
        open: true,
        static: path.resolve(__dirname, '../', 'public')
    },
    module: {
        rules: [{
                test: /\.txt$/,
                use: 'raw-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(sass|scss)$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(jpg|png|svg|gif|jpeg)$/,
                use: 'file-loader'
            },
            {
                test: /\.ts$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: [
                        ["@babel/preset-env", {
                            useBuiltIns: 'usage',
                            corejs: "2.0.0"
                        }],
                        "@babel/typescript"
                    ],
                    plugins: ["@babel/plugin-proposal-class-properties"]
                }
            }

        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "src/templates/template.html"
        })
        // new HtmlWebpackPlugin({
        //     template: "src/templates/index.html",
        //     filename: "index.html"
        // }),
        // new HtmlWebpackPlugin({
        //     template: "src/templates/cele.html",
        //     filename: "cele.html"
        // })
    ]
}