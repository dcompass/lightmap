/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/

/* eslint-disable global-require */
require('dotenv').config();

const path = require('path');
const webpack = require('webpack');
const extend = require('extend')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const pkg = require(path.resolve(process.cwd(), './package.json'));
const config_head = require(path.resolve(process.cwd(), './config/external.json'));
const HappyPack = require('happypack');
const debug = process.env.NODE_ENV === 'development';
const verbose = process.env.VERBOSE === 'true';
const hmr = process.env.HMR === 'true';

const babelConfig = Object.assign({}, pkg.babel, {
  babelrc: false,
  cacheDirectory: hmr,
});

var externalss = config_head.production.scripts
  .filter(name =>name.import)
  .map(sc => {
    return { [sc.import]: sc.identifier };
  }).reduce((prev, curr) => {
    var curr = Object.assign({}, prev, curr);
    return (prev, curr);
  });

externalss = Object.assign({}, externalss, {
  'react-addons-transition-group': 'React.addons.TransitionGroup',
  'react-addons-pure-render-mixin': 'React.addons.PureRenderMixin',
  'react-addons-create-fragment': 'React.addons.createFragment',
  'react-addons-update': 'React.addons.update'
});

const exposevar = {
  'process': {
    'env': {
      'BROWSER': true,
      'HOSTIMG': JSON.stringify(process.env['HOSTIMG']),
      'SITE': JSON.stringify(process.env['SITEDEV']),
      'SITEDEVFR': JSON.stringify(process.env['SITEDEVFR']),
      'WEB_HOST': JSON.stringify(process.env['WEB_HOST']),
      'WEB_PORT': JSON.stringify(process.env['WEB_PORT']),
      'API_HOST': JSON.stringify(process.env['API_HOST']),
      'API_PORT': JSON.stringify(process.env['API_PORT']),
      'IO_HOST': JSON.stringify(process.env['IO_HOST']),
      'IO_PORT': JSON.stringify(process.env['IO_PORT'])
    }
  }
}

const configvar = {
//  '__resourceQuery': '"?path=https://fr.skiscool.com/__webpack_hmr"', //in nginx :3001
  'process.env.NODE_ENV': debug ? '"development"' : '"production"',
  'process.env.__DEV__': debug,
}
// Webpack configuration (main.js => public/dist/main.{hash}.js)
// http://webpack.github.io/docs/configuration.html
const config = {

  // The base directory for resolving the entry option
  context: process.cwd(),
  entry: {
    main: ['react', 'react-dom', './maindev.js'],
    vendor: ['font-awesome-webpack!' + path.resolve(process.cwd(), './font-awesome.configdev.js'), 'mobx', 'mobx-react', 'lodash']
  },

  // Options affecting the output of the compilation
  output: {
    path: path.resolve(process.cwd(), './public/dist'),
    publicPath: '/dist/',
    filename: debug ? '[name].js?[hash]' : '[name].[hash].js',
    chunkFilename: debug ? '[name].js?[chunkhash]' : '[name].[chunkhash].js',
    sourcePrefix: '  ',
  },

  // Switch loaders to debug or release mode
  //debug,

  // Developer tool to enhance debugging, source maps
  // http://webpack.github.io/docs/configuration.html#devtool
  devtool: debug ? 'source-map' : false,

  // What information should be printed to the console
  stats: {
    colors: true,
    reasons: debug,
    hash: verbose,
    version: verbose,
    timings: true,
    //chunks: verbose,
    //chunkModules: verbose,
    // cached: verbose,
    // cachedAssets: verbose,
  },
  lazy: false,
  stats: {
    cached: false,
    cachedAssets: false
  },
  /*
   eslint: {
   failOnWarning: false,
   failOnError: true
   },*/
  // The list of plugins for Webpack compiler
  plugins: [
    new webpack.DefinePlugin(extend(true, {}, configvar, exposevar)),
    new HappyPack({
      id: 'jsx',
      // loaders is the only required parameter:
      loaders: [`babel-loader?${JSON.stringify(babelConfig)}`]
    }),
    // Emit a JSON file with assets paths
    // https://github.com/sporto/assets-webpack-plugin#options

    new CopyWebpackPlugin([{
      from: 'assets',
      to: ''
    }], {
      ignore: [
        // Doesn't copy any files with a txt extension
        '*.txt',
        // Doesn't copy any file, even if they start with a dot
        { glob: 'tiles/16/**/*', dot: true },
        { glob: 'tiles/17/**/*', dot: true },
        { glob: 'tiles/18/**/*', dot: true },
        { glob: 'tiles/19/**/*', dot: true },
        { glob: 'tiles/20/**/*', dot: true }
      ],
      copyUnmodified: false
    }),
    new AssetsPlugin({
      path: path.resolve(process.cwd(), './public/dist'),
      filename: 'assets.json',
      prettyPrint: true,
    }),
  ],

  // Options affecting the normal modules
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loaders: ['happypack/loader?id=jsx'],
      /*include: [
       path.resolve(process.cwd(), './store'),
       path.resolve(process.cwd(), './shared'),
       path.resolve(process.cwd(), './actions'),
       path.resolve(process.cwd(), './components'),
       path.resolve(process.cwd(), './core'),
       path.resolve(process.cwd(), './pages'),
       path.resolve(process.cwd(), './routes'),
       path.resolve(process.cwd(), './main.js'),
       ],*/
      // loader: `babel-loader?${JSON.stringify(babelConfig)}`,
    }, {
      test: /App\.css$/, // only App will go through this loader. e.g. app.css
      loaders: [
        'style-loader',
        'css?sourceMap&-minimize',
        'postcss'
      ]
    }, {
      test: /^((?!\App\.css).)*\.css/,
      loaders: [
        'style-loader',
        `css-loader?${JSON.stringify({
          sourceMap: debug,
          // CSS Modules https://github.com/css-modules/css-modules
          modules: true,
          localIdentName: debug ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]',
          // CSS Nano http://cssnano.co/options/
          minimize: !debug,
        })}`,
        'postcss',
      ],

      // happy: { id: 'css' }
    },
      /*
       {
       test: /\.css/,
       loaders: [
       'style-loader',
       `css-loader?${JSON.stringify({
       sourceMap: debug,
       // CSS Modules https://github.com/css-modules/css-modules
       modules: true,
       localIdentName: debug ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]',
       // CSS Nano http://cssnano.co/options/
       minimize: !debug,
       })}`,
       'postcss-loader',
       ],
       },*/
      {
        test: /\.json$/,
        exclude: /routes/,
        /* path.resolve(process.cwd(), './routes.json'),
         ],*/
        loader: 'json-loader',
      }, {
        test: /\.json$/,
        include: [
          path.resolve(process.cwd(), './routes.json'),
          path.resolve(process.cwd(), './routes_pt.json'),
          path.resolve(process.cwd(), './routes_fr.json'),
          path.resolve(process.cwd(), './routes_ru.json'),
          path.resolve(process.cwd(), './routes_uk.json')
        ],
        loaders: [
          `babel-loader?${JSON.stringify(babelConfig)}`,
          path.resolve(process.cwd(), './utils/routes-loader.js'),
        ],
      }, {
        test: /\.md$/,
        loader: path.resolve(process.cwd(), './utils/markdown-loader.js'),
      },
      /*{
       test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
       exclude: /tiles/,
       loader: 'url-loader?limit=10000',
       }, */
      {
        test: /\.woff(\?.*)?$/,
        loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff'
      }, {
        test: /\.woff2(\?.*)?$/,
        loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2'
      }, {
        test: /\.otf(\?.*)?$/,
        loader: 'file?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype'
      }, {
        test: /\.ttf(\?.*)?$/,
        loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream'
      }, {
        test: /\.eot(\?.*)?$/,
        loader: 'file?prefix=fonts/&name=[path][name].[ext]'
      }, {
        test: /\.svg(\?.*)?$/,
        loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml'
      }, {
        test: /\.(wav|mp3)$/,
        loader: 'file-loader',
      },
    ],
  },
  resolve: {
    //  packageMains: ['webpack', 'browser', 'web', 'style', 'main'],

    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json'],

  },
  /* eslint: {
    failOnWarning: false,
    failOnError: true
   },*/
  
  // externals: externalss,
  // The list of plugins for PostCSS
  // https://github.com/postcss/postcss
  postcss(bundler) {
    return [
      // Transfer @import rule by inlining content, e.g. @import 'normalize.css'
      // https://github.com/postcss/postcss-import
      require('postcss-import')({
        addDependencyTo: bundler
      }),
      // W3C variables, e.g. :root { --color: red; } div { background: var(--color); }
      // https://github.com/postcss/postcss-custom-properties
      require('postcss-custom-properties')(),
      // W3C CSS Custom Media Queries, e.g. @custom-media --small-viewport (max-width: 30em);
      // https://github.com/postcss/postcss-custom-media
      require('postcss-custom-media')(),
      // CSS4 Media Queries, e.g. @media screen and (width >= 500px) and (width <= 1200px) { }
      // https://github.com/postcss/postcss-media-minmax
      require('postcss-media-minmax')(),
      // W3C CSS Custom Selectors, e.g. @custom-selector :--heading h1, h2, h3, h4, h5, h6;
      // https://github.com/postcss/postcss-custom-selectors
      require('postcss-custom-selectors')(),
      // W3C calc() function, e.g. div { height: calc(100px - 2em); }
      // https://github.com/postcss/postcss-calc
      require('postcss-calc')(),
      // Allows you to nest one style rule inside another
      // https://github.com/jonathantneal/postcss-nesting
      require('postcss-nesting')(),
      // W3C color() function, e.g. div { background: color(red alpha(90%)); }
      // https://github.com/postcss/postcss-color-function
      require('postcss-color-function')(),
      // Convert CSS shorthand filters to SVG equivalent, e.g. .blur { filter: blur(4px); }
      // https://github.com/iamvdo/pleeease-filters
      require('pleeease-filters')(),
      // Generate pixel fallback for "rem" units, e.g. div { margin: 2.5rem 2px 3em 100%; }
      // https://github.com/robwierzbowski/node-pixrem
      require('pixrem')(),
      // W3C CSS Level4 :matches() pseudo class, e.g. p:matches(:first-child, .special) { }
      // https://github.com/postcss/postcss-selector-matches
      require('postcss-selector-matches')(),
      // Transforms :not() W3C CSS Level 4 pseudo class to :not() CSS Level 3 selectors
      // https://github.com/postcss/postcss-selector-not
      require('postcss-selector-not')(),
      // Add vendor prefixes to CSS rules using values from caniuse.com
      // https://github.com/postcss/autoprefixer
      require('autoprefixer')(),
    ];
  },

};

// new webpack.optimize.CommonsChunkPlugin('bundle' null, false)
// Optimize the bundle in release (production) mode

//config.plugins.push(new webpack.optimize.DedupePlugin()); // deduplicates equal or similar files

config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());

config.plugins.push(new webpack.IgnorePlugin(/regenerator|nodent|js\-beautify/, /ajv/));

config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
  name: "vendor",
  chunks: ['main'],
  minChunks: Infinity,
}))
/*
 config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
 names: ['vendor','manifest']
 }));*/

// Hot Module Replacement (HMR) + React Hot Reload
if (hmr) {
  babelConfig.plugins.unshift('react-hot-loader/babel');
  config.entry.main.unshift('react-hot-loader/patch', 'webpack-hot-middleware/client');
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new webpack.NoErrorsPlugin());
}

module.exports = config;
