const path = require('path');
const os = require('os');
const slsw = require('serverless-webpack');
const TerserPlugin = require('terser-webpack-plugin');
const ThreadLoader = require('thread-loader');

/**
 * Generate absolute path to a folder that is a child of `src`
 *
 * Used for path aliases
 * @param {string} subdir relative path to the folder with `src` as root
 */
const srcPath = (subdir) => path.join(__dirname, 'src', subdir);

/**
 *  This Env Var signifies if we are running in our CI/CD system
 */
const CI = process.env.CI === 'true';

const threadLoaderOptions = { workers: os.cpus().length };

// Pre-Warming the thread pool increases performance
ThreadLoader.warmup(threadLoaderOptions, ['ts-loader']);

module.exports = {
    context: __dirname,
    entry: slsw.lib.entries,
    externals: [{
        'aws-sdk': 'commonjs aws-sdk'
    }],
    stats: 'minimal', // NOTE: i am sick of how much webpack complains about nothing
    resolve: {
        alias: {
            // helpers: srcPath('helpers'),
            // types: srcPath('@types'),
            packageJson: path.join(__dirname, 'package.json'),
        },
        extensions: [
            '.js',
            '.json',
            '.ts',
            '.tsx',
        ],
    },
    output: {
        libraryTarget: 'commonjs',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js',
    },
    target: 'node',
    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: CI ? false : '.uglify-cache', // If we're on the CI server, don't bother building a cache, it'll just be discarded
                parallel: true,
                terserOptions: {
                    ecma: 6, // NOTE: Once we upgrade to Node 10.x in Lambda we can upgrade this
                },
            })
        ],
    },
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: [
                ...(CI ? [] : [{ loader: 'cache-loader' }]), // If we're on the CI server, don't bother building a cache, it'll just be discarded
                {
                    loader: 'thread-loader',
                    options: threadLoaderOptions,
                },
                {
                    loader: 'ts-loader',
                    options: {
                        happyPackMode: true, // This implies transpile only, we check syntax errors all up front before compilation 🤯
                    },
                },
            ],
        }],
    },
};
