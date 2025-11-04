/**
 * Webpack Configuration.
 */

const path = require( 'path' );
const { ProvidePlugin } = require( 'webpack' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const WooCommerceDependencyExtractionWebpackPlugin = require( '@woocommerce/dependency-extraction-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

const wcDepMap = {
    '@woocommerce/blocks-registry': ['wc', 'wcBlocksRegistry'],
    '@woocommerce/settings'       : ['wc', 'wcSettings'],
    // '@woocommerce/icons'       : ['wc', 'wcIcons'],

};

const wcHandleMap = {
    '@woocommerce/blocks-registry': 'wc-blocks-registry',
    '@woocommerce/settings'       : 'wc-settings',
    // '@woocommerce/icons'		  : 'wc-icons'
};

const requestToExternal = (request) => {
    if (wcDepMap[request]) {
        return wcDepMap[request];
    }
};

const requestToHandle = (request) => {
    if (wcHandleMap[request]) {
        return wcHandleMap[request];
    }
};

const CLIENT_DIR = path.resolve( __dirname, 'assets' );

const entry = {
    index: CLIENT_DIR + '/blocks/index.js',
    settings: CLIENT_DIR + '/admin/settings/index.js',
    editor: CLIENT_DIR + '/admin/editor/index.js'
};

const rules = [
    {
        test: /\.(png|jpg|svg|jpeg|gif|ico)$/,
        use: {
            loader: 'file-loader',
        },
    },
    {
        test: /\.s[ac]ss$/i,
        use: [
            // Creates `style` nodes from JS strings
            "style-loader",
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader",
        ],
    },
];

module.exports = {
    ...defaultConfig,
    devtool:
        process.env.NODE_ENV === 'production'
            ? 'hidden-source-map'
            : defaultConfig.devtool,
    optimization: {
        ...defaultConfig.optimization,
        minimizer: [
            ...defaultConfig.optimization.minimizer.map( ( plugin ) => {
                if ( plugin.constructor.name === 'TerserPlugin' ) {
                    // wp-scripts does not allow to override the Terser minimizer sourceMap option, without this
                    // `devtool: 'hidden-source-map'` is not generated for js files.
                    plugin.options.sourceMap = true;
                }
                return plugin;
            } ),
        ],
        splitChunks: undefined,
    },
    plugins: [
        ...defaultConfig.plugins.filter(
            ( plugin ) =>
                plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
        ),
        new WooCommerceDependencyExtractionWebpackPlugin(
            {
                requestToExternal,
                requestToHandle
            }
        ),
        new ProvidePlugin( {
            process: 'process/browser.js',
        } ),
        new MiniCssExtractPlugin( { filename: 'style.css' } ),
    ],
    resolve: {
        extensions: [ '.json', '.js', '.jsx' ],
        modules: [ CLIENT_DIR, 'node_modules' ],
        alias: {
            wcnovac: CLIENT_DIR,
        },
    },
    entry,

    module: {
        ...defaultConfig.module,
        rules: [
            ...defaultConfig.module.rules,
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
        ],
    },
};