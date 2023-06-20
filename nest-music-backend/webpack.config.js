const path = require("path");
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const WebPackIgnorePlugin =
{
    checkResource: function (resource) {
        const lazyImports =
            [
                '@nestjs/microservices',
                '@nestjs/microservices/microservices-module',
                '@nestjs/websockets/socket-module',
                '@fastify/static',
                'cache-manager',
                'class-transformer',
                'class-validator',
                'fastify-static',
            ];

        if (!lazyImports.includes(resource))
            return false;

        try {
            require.resolve(resource);
        }
        catch (err) {
            return true;
        }

        return false;
    }
};

let dev =
{
    mode: 'production',
    target: 'node',
    entry:
    {
        server: './src/main.ts',
    },
    devtool: 'source-map',
    module:
    {
        rules:
            [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
    },
    resolve:
    {
        extensions: ['.tsx', '.ts', '.js'],
    },
    node: {
        __dirname: false,
    },
    plugins:
        [
            new CleanWebpackPlugin(),
            new webpack.IgnorePlugin(WebPackIgnorePlugin),
        ],
    optimization:
    {
        minimize: false
    },
    performance:
    {
        maxEntrypointSize: 1000000000,
        maxAssetSize: 1000000000
    },
    output:
    {
        filename: '[name].js',
        path: path.resolve(__dirname, 'prod'),
    },
};

let prod =
{
    mode: 'production',
    target: 'node',
    entry:
    {
        server: './src/main.ts',
    },
    devtool: 'source-map',
    module:
    {
        rules:
            [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
    },
    resolve:
    {
        extensions: ['.tsx', '.ts', '.js'],
        // alias: {
        //     [path.resolve(__dirname, "src/environment/environment.ts")]: path.resolve(__dirname, "src/environment/environment.prod.ts")
        // }
    },
    node: {
        __dirname: false,
    },
    plugins:
        [
            new CleanWebpackPlugin(),
            new webpack.IgnorePlugin(WebPackIgnorePlugin),
            new webpack.NormalModuleReplacementPlugin(
                /(\benvironment\b)(?!.*\1)/,
                function (resource) {
                    resource.request = resource.request.replace(
                        /(\benvironment\b)(?!.*\1)/,
                        `environment.prod`
                    );
                }
            )
        ],
    optimization:
    {
        minimize: false
    },
    performance:
    {
        maxEntrypointSize: 1000000000,
        maxAssetSize: 1000000000
    },
    output:
    {
        filename: '[name].js',
        path: path.resolve(__dirname, 'standalone'),
    }
};

module.exports = (env) => {
    return !env.environment ? dev: prod;
}