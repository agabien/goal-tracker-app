const path = require('path');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    entry: {
        main: './src/index.ts',
    },
    output: {
        filename: 'js/[name]-[contenthash:4].js',
        path: path.resolve(__dirname, '../', 'dist')
    },
    module: {
        rules: [{
                test: /\.txt$/,
                use: 'raw-loader'
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        "autoprefixer"
                                    ],
                                ],
                            },
                        },
                    }
                ]
            },
            {
                test: /\.(sass|scss)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        "autoprefixer"
                                    ],
                                ],
                            },
                        },
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.(jpg|png|svg|gif|jpeg)$/,
                use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[name][contenthash:4].[ext]',
                            outputPath: 'images'
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                quality: 70,
                                progressive: true
                            }
                        }
                    }
                ]
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
            template: "src/templates/template.html",
            minify: {
                collapseWhitespace: true
            }
        }),
        // new HtmlWebpackPlugin({
        //     template: "src/templates/index.html",
        //     filename: "index.html",
        //     minify: {
        //         collapseWhitespace: true
        //     }
        // }),
        // new HtmlWebpackPlugin({
        //     template: "src/templates/cele.html",
        //     filename: "cele.html",
        //     minify: {
        //         collapseWhitespace: true
        //     }
        // }),
        new MiniCssExtractPlugin({
            filename: '[name]-[contenthash:4].css'
        }),
        new CopyPlugin({
            patterns: [{
                from: 'public/images',
                to: 'images'
            }]
        })
    ]
}