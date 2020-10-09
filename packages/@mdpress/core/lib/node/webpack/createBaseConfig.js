'use strict';

/**
 * Module dependencies.
 */

const { fs, path, logger, env } = require('@mdpress/shared-utils');

/**
 * Expose createBaseConfig method.
 */

module.exports = function createBaseConfig (context, isServer) {
  const {
    siteConfig,
    sourceDir,
    outDir,
    base: publicPath,
    markdown,
    tempPath,
    cacheDirectory,
    cacheIdentifier,
    options: {
      cache
    },
    pluginAPI
  } = context;

  const Config = require('webpack-chain');
  const CSSExtractPlugin = require('mini-css-extract-plugin');

  const isProd = process.env.NODE_ENV === 'production';
  const inlineLimit = 10000;

  const config = new Config();
  const extractHeaders = siteConfig.markdown && siteConfig.markdown.extractHeaders;

  config
    .mode(isProd && !env.isDebug ? 'production' : 'development')
    .output
    .path(outDir)
    .filename(isProd ? 'assets/js/[name].[chunkhash:8].js' : 'assets/js/[name].js')
    .publicPath(publicPath);

  if (env.isDebug) {
    config.devtool('source-map');
  } else if (!isProd) {
    config.devtool('cheap-module-eval-source-map');
  }

  const modulePaths = getModulePaths();
  const clientDir = context.getLibFilePath('client');

  config.resolve
    .set('symlinks', true)
    .alias
    .set('@source', sourceDir)
    .set('@client', clientDir)
    .set('@app', clientDir)
    .set('@loading', path.resolve(clientDir,'components/loading.js'))
    .set('@temp', tempPath)
    .set('@dynamic', path.resolve(tempPath, 'dynamic'))
    .set('@internal', path.resolve(tempPath, 'internal'))
    .end()
    .extensions
    .merge(['.js', '.jsx', '.json', '.styl'])
    .end()
    .modules
    .merge(modulePaths);

  config.resolveLoader
    .set('symlinks', true)
    .modules
    .merge(modulePaths);

  config.module
    .noParse(/^(react|react-dom|react-loadabel|react-router|react-router-dom)$/);


  if (cache === false) {
    logger.tip('Clean cache...\n');
    fs.emptyDirSync(cacheDirectory);
  }

  const finalCacheIdentifier = cacheIdentifier + `isServer:${isServer}`;

  const babelOptions = {
    'plugins': [
      require.resolve('babel-plugin-syntax-dynamic-import'),
      // require.resolve('babel-plugin-dynamic-import-node'),
      require.resolve('babel-plugin-transform-class-properties'),
      require.resolve('babel-plugin-react-html-attrs'),
      [
        require.resolve('babel-plugin-transform-runtime'),
        {
          'regenerator': true
        }
      ],
      require('./babel/autoCssModule')
    ],
    'presets': [
      require.resolve('babel-preset-es2015'),
      require.resolve('babel-preset-es2017'),
      require.resolve('babel-preset-stage-3'),
      require.resolve('babel-preset-react'),
    ],
    'babelrc': false
  };

  function applyReactPipeline (rule) {
    rule
      .use('cache-loader')
      .loader('cache-loader')
      .options({
        cacheDirectory,
        cacheIdentifier: finalCacheIdentifier
      });

    const libDir = path.join(__dirname, '..');
    rule
      .use('babel-loader').loader('babel-loader').options(babelOptions).end()
      .exclude.add(filePath => {
        // Always transpile lib directory
        if (filePath.startsWith(libDir)) {
          return false;
        }

        filePath = filePath.replace(process.cwd(),'');
        // transpile all core packages and mdpress related packages.
        // i.e.
        // @mdpress/*
        // mdpress-*
        if (/(@mdpress[\/\\][^\/\\]*|mdpress-[^\/\\]*)[\/\\](?!node_modules).*\.js$/.test(filePath)) {
          return false;
        }
        // Don't transpile node_modules
        return /node_modules/.test(filePath);
      }).end();
  }

  const reactRule = config.module
    .rule('react')
    .test(/\.js$/);

  applyReactPipeline(reactRule);

  const mdRule = config.module
    .rule('markdown')
    .test(/\.md$/);

  applyReactPipeline(mdRule);

  mdRule
    .use('markdown-loader')
    .loader(require.resolve('@mdpress/markdown-loader'))
    .options({ sourceDir, markdown, extractHeaders });

  config.module
    .rule('pug')
    .test(/\.pug$/)
    .use('pug-plain-loader')
    .loader('pug-plain-loader')
    .end();

  config.module
    .rule('images')
    .test(/\.(png|jpe?g|gif)(\?.*)?$/)
    .use('url-loader')
    .loader('url-loader')
    .options({
      limit: inlineLimit,
      name: 'assets/img/[name].[hash:8].[ext]'
    });

  // do not base64-inline SVGs.
  // https://github.com/facebookincubator/create-react-app/pull/1180
  config.module
    .rule('svg')
    .test(/\.(svg)(\?.*)?$/)
    .use('file-loader')
    .loader('file-loader')
    .options({
      name: 'assets/img/[name].[hash:8].[ext]'
    });

  config.module
    .rule('media')
    .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
    .use('url-loader')
    .loader('url-loader')
    .options({
      limit: inlineLimit,
      name: 'assets/media/[name].[hash:8].[ext]'
    });

  config.module
    .rule('fonts')
    .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
    .use('url-loader')
    .loader('url-loader')
    .options({
      limit: inlineLimit,
      name: 'assets/fonts/[name].[hash:8].[ext]'
    });

  function createCSSRule (lang, test, loader, options) {
    const baseRule = config.module.rule(lang).test(test);
    const modulesRule = baseRule.oneOf('modules').resourceQuery(/module/);
    const normalRule = baseRule.oneOf('normal');

    applyLoaders(modulesRule, true);
    applyLoaders(normalRule, false);

    function applyLoaders (rule, modules) {
      if (!isServer) {
        if (isProd) {
          rule.use('extract-css-loader').loader(CSSExtractPlugin.loader);
        } else {
          rule.use('style-loader').loader('style-loader');
        }
      }

      rule.use('css-loader')
        .loader('css-loader')
        .options({
          modules,
          localIdentName: '[local]_[hash:base64:8]',
          importLoaders: 1,
          sourceMap: !isProd,
          exportOnlyLocals: isServer
        });

      rule.use('postcss-loader').loader('postcss-loader').options(Object.assign({
        plugins: [require('autoprefixer')],
        sourceMap: !isProd
      }, siteConfig.postcss));

      if (loader) {
        rule.use(loader).loader(loader).options(options);
      }
    }
  }

  createCSSRule('css', /\.css$/);
  createCSSRule('postcss', /\.p(ost)?css$/);
  createCSSRule('scss', /\.scss$/, 'sass-loader', siteConfig.scss);
  createCSSRule('sass', /\.sass$/, 'sass-loader', Object.assign({ indentedSyntax: true }, siteConfig.sass));
  createCSSRule('less', /\.less$/, 'less-loader', siteConfig.less);
  createCSSRule('stylus', /\.styl(us)?$/, 'stylus-loader', Object.assign({
    preferPathResolver: 'webpack'
  }, siteConfig.stylus));

  if (isProd && !isServer) {
    config
      .plugin('extract-css')
      .use(CSSExtractPlugin, [{
        filename: 'assets/css/styles.[chunkhash:8].css'
      }]);

    // ensure all css are extracted together.
    // since most of the CSS will be from the theme and very little
    // CSS will be from async chunks
    config.optimization.splitChunks({
      cacheGroups: {
        styles: {
          name: 'styles',
          // necessary to ensure async chunks are also extracted
          test: m => {
            return /css\/mini-extract/.test(m.type);
          },
          chunks: 'all',
          enforce: true
        }
      }
    });
  }

  // inject constants
  config
    .plugin('injections')
    .use(require('webpack/lib/DefinePlugin'), [{
      MDPRESS_VERSION: JSON.stringify(require('../../../package.json').version),
      MDPRESS_TEMP_PATH: JSON.stringify(tempPath),
      LAST_COMMIT_HASH: JSON.stringify(getLastCommitHash())
    }]);

  pluginAPI.applySyncOption('define', config);
  pluginAPI.applySyncOption('alias', config);

  return config;
};

function getLastCommitHash () {
  const spawn = require('cross-spawn');
  let hash;
  try {
    hash = spawn.sync('git', ['log', '-1', '--format=%h']).stdout.toString('utf-8').trim();
  } catch (error) {
    console.error(error);
  }
  return hash;
}

function getModulePaths () {
  const markdownIt = path.dirname(require.resolve('markdown-it/package.json'));
  const scrollBehaviorDir = path.dirname(require.resolve('scroll-behavior/package.json'));
  const ReactTransitionGroup = path.dirname(require.resolve('react-transition-group/package.json'));
  const babelRuntime = path.dirname(require.resolve('babel-runtime/package.json'));
  const paths = module.paths.concat([
    path.resolve(markdownIt,'node_modules'),// Info: entity version of markdown-it is older
    path.resolve(babelRuntime,'node_modules'),// Info: core-js version of babel-runtime is older
    path.resolve(scrollBehaviorDir,'node_modules'),// Info: dom-helper version of scroll-behavior is older
    path.resolve(ReactTransitionGroup,'node_modules'),// Info: dom-helper version of react-transition-group is older
    path.resolve(process.cwd(), 'node_modules')
  ]);
  return paths;
}
