const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
//分析出模块之间的依赖关系，尽可能的把打散的模块合并到一个函数中去，
//但前提是不能造成代码冗余。 因此只有那些被引用了一次的模块才能被合并。
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');
const autoprefixer = require('autoprefixer');
const paths = require("./config/paths");
const devServer = require("./config/devServer");

// npm run dev的时候，publicPath = "/"
// npm run build的时候，publicPath = "./"
let publicPath = "/";
let currentEnv = process.env.NODE_ENV;
let mode = "development";
let devtool = 'cheap-module-source-map';
let extractfileName = 'assets/css/[name].css';
let outputFileName = 'assets/js/[name].js';
let outputChunkName = 'assets/js/[name].js';
let plugins = [
    // 如果路径有误则直接报错。
    new CaseSensitivePathsPlugin(),
    // 当开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境。
    new webpack.NamedModulesPlugin(),
];

const cssLoader = {
    test: /\.css$/i,
    exclude: [/node_modules/],
    use: [
        MiniCssExtractPlugin.loader,
        {
            loader: "css-loader",
            options: {
                importLoaders: 1,
                sourceMap: true,
            }
        }, {
            loader: 'postcss-loader',
            options: {
                ident: 'postcss',
                plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                        browsers: [
                            "iOS >= 7", "Android >= 4"
                        ],
                    })
                ],
            },
        }
    ]
}
const imgLoader = {
    test: /\.(jpe?g|png|gif|svg)$/i,
    loader: 'url-loader',
    options: {
        //小于10kb的图片转成base64。
        limit: 10000,
        fallback: "file-loader?name=assets/images/[name].[ext]"
    }
}

const jsLoader = {
    test: /\.js$/,
    include: paths.appSrc,
    exclude: /[\\/]libs[\\/]/,
    loader: require.resolve('babel-loader'),
    options: {
        cacheDirectory: true,
    },
};

let baseConfig = {
    mode: mode,
    target: "web",
    devtool: devtool,
    entry: paths.entriesMap,
    output: {
        pathinfo: true,
        path: paths.appBuild,
        filename: outputFileName,
        chunkFilename: outputChunkName,
        publicPath: publicPath
    },
    //控制只显示错误信息
    stats: "errors-only",
    //在第一个错误出错时抛出，而不是无视错误
    bail: true,
    resolve: {
        alias: {
            pages: path.resolve(__dirname, "src/pages"),
            utils: path.resolve(__dirname, "src/utils"),
            common: path.resolve(__dirname, "src/common"),
            components: path.resolve(__dirname, "src/components"),
        },
        extensions: ['.js', '.json', '.jsx'],
        //resolve.modules 配置 Webpack 去哪些目录下寻找第三方模块，默认是只会去 node_modules 目录下寻找。
        modules: ['node_modules', paths.appNodeModules],
        // Tree Shaking  针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
        mainFields: ['jsnext:main', 'browser', 'main']
    },
    module: {
        //这里设置为true,表明文件中如果缺少exports时会直接报错而不是警告
        strictExportPresence: true,
        rules: [
            {
                test: /\.bundle\.js$/,
                loader: 'bundle-loader',
                include: path.join(__dirname, 'src'),
                options: {
                    lazy: true,
                    name: '[name]'
                }
            },
            {
                oneOf: [
                    jsLoader,
                    cssLoader,
                    imgLoader,
                ],
            }
        ]
    },
    optimization: {
        runtimeChunk: {
            name: 'manifest'
        },
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true, // set to true if you want JS source maps,
                uglifyOptions: {
                    // 在UglifyJs删除没有用到的代码时不输出警告
                    warnings: false,
                    output: {
                        // 删除所有的注释
                        comments: true,
                        beautify: true,
                        ascii_only: true,
                    },
                    compress: {
                        comparisons: false,
                        //删除debugger, 只有在编译线上环境的时候，删除debugger
                        drop_debugger: currentEnv === "production",
                        //删除console.log 保留error
                        pure_funcs: ['console.log'],
                        //删除所有console, 只有在编译线上环境的时候，删除console
                        drop_console: currentEnv === "production"
                    },
                },
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    minChunks: 1,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    plugins: [
        // 定义环境变量
        new webpack.DefinePlugin({
            'process.env': {
                // JSON.stringify('production')的值正好等于'"production"'
                NODE_ENV: JSON.stringify(currentEnv)
            }
        }),
        // 开启 Scope Hoisting
        new ModuleConcatenationPlugin(),
        new MiniCssExtractPlugin({
            filename: extractfileName,
            chunkFilename: extractfileName,
        }),
        //生成 manifest 方便定位对应的资源文件
        new ManifestPlugin({
            fileName: 'asset-manifest.json',
        }),
        new HtmlWebpackPlugin({
            hash: false,
            template: "./src/index.html"
        }),
        ...plugins
    ]
};
if (currentEnv === "local") {
    baseConfig = Object.assign({}, baseConfig, {
        watch: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000,
            ignored: /node_modules/
        },
        devServer: devServer
    });
}

module.exports = baseConfig;