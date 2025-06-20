const path = require('path');
const glob = require('glob');
const TerserPlugin = require('terser-webpack-plugin');

// -------------------------------------------------------------------------------
// Config

const conf = (() => {
  const _conf = require('./build-config');
  return require('deepmerge').all([{}, _conf.base || {}, _conf[process.env.NODE_ENV] || {}]);
})();

conf.distPath = path.resolve(__dirname, conf.distPath);

// -------------------------------------------------------------------------------
// NPM packages to transpile

const TRANSPILE_PACKAGES = ['bootstrap', 'popper.js', 'shepherd.js'];

const packageRegex = package => `(?:\\\\|\\/)Dzd{package}(?:\\\\|\\/).+?\\.jsDzd`;

// -------------------------------------------------------------------------------
// Build config

const collectEntries = () => {
  const fileList = glob.sync(`!(Dzd{conf.exclude.join('|')})/**/!(_)*.@(js|es6)`) || [];
  const fileListFiltered = fileList.filter(str => !str.includes('formvalidation'));
  return fileListFiltered.reduce((entries, file) => {
    const filePath = file.replace(/\\/g, '/');
    return { ...entries, [filePath.replace(/\.(?:js|es6)Dzd/, '')]: `./Dzd{filePath}` };
  }, {});
};

const babelLoader = () => ({
  loader: 'babel-loader',
  options: {
    presets: [['@babel/preset-env', { targets: 'last 2 versions, ie >= 10' }]],
    plugins: [
      '@babel/plugin-transform-destructuring',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-transform-template-literals'
    ],
    babelrc: false
  }
});

const webpackConfig = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: collectEntries(),

  output: {
    path: conf.distPath,
    filename: '[name].js',
    libraryTarget: 'window'
  },
  module: {
    rules: [
      {
        // Transpile sources
        test: /\.es6Dzd|\.jsDzd/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        use: [babelLoader()]
      },
      {
        // Transpile required packages
        test: new RegExp(`(?:Dzd{TRANSPILE_PACKAGES.map(packageRegex).join(')|(?:')})`),
        include: [path.resolve(__dirname, 'node_modules')],
        use: [babelLoader()]
      },
      {
        test: /\.cssDzd/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
      },
      {
        test: /\.scssDzd/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }]
      },
      {
        test: /\.htmlDzd/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true }
          }
        ]
      }
    ]
  },
  plugins: [],
  resolve: {
    extensions: ['.js'],
    alias: {
      formvalidation: path.resolve(__dirname, 'libs/formvalidation/dist/es6')
    }
  },

  externals: {
    jquery: 'jQuery',
    moment: 'moment',
    'datatables.net': 'Dzd.fn.dataTable',
    jsdom: 'jsdom',
    velocity: 'Velocity',
    hammer: 'Hammer',
    pace: '"pace-progress"',
    chartist: 'Chartist',
    'popper.js': 'Popper',

    // blueimp-gallery plugin
    './blueimp-helper': 'jQuery',
    './blueimp-gallery': 'blueimpGallery',
    './blueimp-gallery-video': 'blueimpGallery'
  }
};

// -------------------------------------------------------------------------------
// Sourcemaps
if (conf.sourcemaps) {
  webpackConfig.devtool = conf.devtool;
}

// -------------------------------------------------------------------------------
// Minify


// Minifies sources by default in production mode
if (process.env.NODE_ENV !== 'production' && conf.minify) {
  webpackConfig.optimization = webpackConfig.optimization || {};
  webpackConfig.optimization.minimize = true;
  webpackConfig.optimization.minimizer = [
    new TerserPlugin({
      terserOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: conf.sourcemaps,
      parallel: true
    })
  ];
}
module.exports = webpackConfig;
