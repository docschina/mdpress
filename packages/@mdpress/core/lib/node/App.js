'use strict';

/**
 * Module dependencies.
 */

const createMarkdown = require('./createMarkdown');
const loadConfig = require('./loadConfig');
const loadTheme = require('./loadTheme');
const { getCacheLoaderOptions } = require('./CacheLoader');
const {
  fs, path, logger, chalk, globby, sort,
  datatypes: { isFunction },
  fallback: { fsExistsFallback }
} = require('@mdpress/shared-utils');

const Page = require('./Page');
const ClientComputedMixin = require('./ClientComputedMixin');
const PluginAPI = require('./plugin-api');
const DevProcess = require('./dev');
const BuildProcess = require('./build');
const createTemp = require('./createTemp');

/**
 * Expose MdPressApp.
 */

module.exports = class App {
  /**
   * Instantiate the app context with a new API
   *
   * @param {string} sourceDir
   * @param {{
   *  plugins: pluginsConfig,
   *  theme: themeNameConfig
   *  temp: string
   * }} options
   */

  constructor (options = {}) {
    this.isProd = process.env.NODE_ENV === 'production';
    this.options = options;
    this.sourceDir = this.options.sourceDir || path.join(__dirname, 'docs.fallback');
    logger.debug('sourceDir', this.sourceDir);
    if (!fs.existsSync(this.sourceDir)) {
      logger.warn(`Source directory doesn't exist: ${chalk.yellow(this.sourceDir)}`);
    }

    this.userDir = path.resolve(this.sourceDir, '.mdpress');
    this.libDir = path.join(__dirname, '../');
  }

  /**
   * Resolve user config and initialize.
   *
   * @returns {Promise<void>}
   * @api private
   */

  async resolveConfigAndInitialize () {
    if (this.options.siteConfig) {
      this.siteConfig = this.options.siteConfig;
    } else {
      let siteConfig = loadConfig(this.userDir);
      if (isFunction(siteConfig)) {
        siteConfig = await siteConfig(this);
      }
      this.siteConfig = siteConfig;
    }

    // TODO custom cwd.
    this.cwd = process.cwd();

    this.base = this.siteConfig.base || '/';
    this.themeConfig = this.siteConfig.themeConfig || {};

    // resolve tempPath
    const rawTemp = this.options.temp || this.siteConfig.temp;
    const { tempPath, writeTemp } = createTemp(rawTemp);
    this.tempPath = tempPath;
    this.writeTemp = writeTemp;

    // resolve outDir
    const rawOutDir = this.options.dest || this.siteConfig.dest;
    this.outDir = rawOutDir
      ? require('path').resolve(this.cwd, rawOutDir)
      : require('path').resolve(this.sourceDir, '.mdpress/dist');

    this.pages = []; // Array<Page>
    this.pluginAPI = new PluginAPI(this);
    this.ClientComputedMixinConstructor = ClientComputedMixin(this.getSiteData());
  }

  /**
   * A asynchronous method used to prepare the context of the current app. which
   * contains loading pages and plugins, apply plugins, etc.
   *
   * @returns {Promise<void>}
   * @api private
   */

  async process () {
    await this.resolveConfigAndInitialize();
    this.normalizeHeadTagUrls();
    this.themeAPI = loadTheme(this);
    this.resolveTemplates();
    this.resolveGlobalLayout();

    this.applyInternalPlugins();
    this.applyUserPlugins();
    this.pluginAPI.initialize();

    this.markdown = createMarkdown(this);

    await this.resolvePages();

    await this.pluginAPI.applyAsyncOption('additionalPages', this);
    await Promise.all(
      this.pluginAPI.getOption('additionalPages').appliedValues.map(async (options) => {
        await this.addPage(options);
      })
    );
    await this.pluginAPI.applyAsyncOption('ready');
    await Promise.all([
      this.pluginAPI.applyAsyncOption('clientDynamicModules', this),
      this.pluginAPI.applyAsyncOption('enhanceAppFiles', this),
      this.pluginAPI.applyAsyncOption('globalUIComponents', this)
    ]);
    await this.pluginAPI.applyAsyncOption('compiled');
  }

  /**
   * Apply internal plugins
   *
   * @api private
   */

  applyInternalPlugins () {
    const themeConfig = this.themeConfig;
    const siteConfig = this.siteConfig;

    const shouldUseLastUpdated = (
      themeConfig.lastUpdated
      || Object.keys(siteConfig.locales && themeConfig.locales || {})
        .some(base => themeConfig.locales[base].lastUpdated)
    );

    this.pluginAPI
    // internl core plugins
      .use(require('./internal-plugins/siteData'))
      .use(require('./internal-plugins/routes'))
      .use(require('./internal-plugins/sandbox'),{
        componentsDir: [
          path.resolve(this.sourceDir, '.mdpress/components'),
          path.resolve(this.themeAPI.theme.path, 'sandbox'),
          this.themeAPI.existsParentTheme && path.resolve(this.themeAPI.parentTheme.path, 'sandbox')
        ]
      })
      .use(require('./internal-plugins/enhanceApp'))
      .use(require('./internal-plugins/palette'))
      .use(require('./internal-plugins/style'))
      .use(require('./internal-plugins/layoutComponents'))
      .use(require('./internal-plugins/pageComponents'))
      .use(require('./internal-plugins/transformModule'))
      .use(require('./internal-plugins/dataBlock'))
      .use(require('./internal-plugins/markdown'))
      .use('@mdpress/container', {
        containers: [{
          type: 'slot',
          before: info => `<div class="markdown-slot" id="${info}">`,
          after: '</div>'
        }]
      })
      .use('@mdpress/last-updated', !!shouldUseLastUpdated);
  }

  /**
   * Apply user plugins
   *
   * @api private
   */

  applyUserPlugins () {
    this.pluginAPI.useByPluginsConfig(this.options.plugins);
    if (this.themeAPI.existsParentTheme) {
      this.pluginAPI.use(this.themeAPI.parentTheme.entry);
    }
    this.pluginAPI
      .use(this.themeAPI.theme.entry)
      .use(this.themeAPI.mdpressPlugin)
      .use(Object.assign({}, this.siteConfig, { name: '@mdpress/internal-site-config' }));
  }

  /**
   * normalize head tag urls for base
   *
   * @api private
   */

  normalizeHeadTagUrls () {
    if (this.base !== '/' && this.siteConfig.head) {
      this.siteConfig.head.forEach(tag => {
        const attrs = tag[1];
        if (attrs) {
          for (const name in attrs) {
            if (name === 'src' || name === 'href') {
              const value = attrs[name];
              if (value.charAt(0) === '/') {
                attrs[name] = this.base + value.slice(1);
              }
            }
          }
        }
      });
    }
  }

  /**
   * Resolve options of cache loader.
   */

  resolveCacheLoaderOptions () {
    Object.assign(this, (getCacheLoaderOptions(this.siteConfig, this.options, this.cwd, this.isProd)));
  }

  /**
   * Make template configurable
   *
   * Resolving Priority (devTemplate as example):
   *
   *   1. siteConfig.devTemplate
   *   2. `dev.html` located at .mdpress/templates
   *   3. themeEntryFile.devTemplate
   *   4. default devTemplate
   *
   * @api private
   */

  resolveTemplates () {
    this.devTemplate = this.resolveCommonAgreementFilePath(
      'devTemplate',
      {
        defaultValue: this.getLibFilePath('client/index.dev.html'),
        siteAgreement: 'templates/dev.html',
        themeAgreement: 'templates/dev.html'
      }
    );

    this.ssrTemplate = this.resolveCommonAgreementFilePath(
      'ssrTemplate',
      {
        defaultValue: this.getLibFilePath('client/index.ssr.html'),
        siteAgreement: 'templates/ssr.html',
        themeAgreement: 'templates/ssr.html'
      }
    );

    logger.debug('SSR Template File: ' + chalk.gray(this.ssrTemplate));
    logger.debug('DEV Template File: ' + chalk.gray(this.devTemplate));
  }

  /**
   * resolve global layout
   *
   * @returns {string}
   * @api private
   */

  resolveGlobalLayout () {
    this.globalLayout = this.resolveCommonAgreementFilePath(
      'globalLayout',
      {
        defaultValue: this.getLibFilePath('client/components/GlobalLayout.js'),
        siteAgreement: 'components/GlobalLayout.js',
        themeAgreement: 'layouts/GlobalLayout.js'
      }
    );

    logger.debug('globalLayout: ' + chalk.gray(this.globalLayout));
  }

  /**
   * Resolve a path-type config.
   *
   * @param {string} configKey
   * @param {string} defaultValue an absolute path
   * @param {string} siteAgreement a relative path to mdpress dir
   * @param {string} themeAgreement a relative path to theme dir
   * @returns {string | void}
   */

  resolveCommonAgreementFilePath (configKey, {
    defaultValue,
    siteAgreement,
    themeAgreement
  }) {
    const siteConfigValue = this.siteConfig[configKey];
    siteAgreement = this.resolveSiteAgreementFile(siteAgreement);

    const themeConfigValue = this.getThemeConfigValue(configKey);
    themeAgreement = this.resolveThemeAgreementFile(themeAgreement);

    return fsExistsFallback([
      siteConfigValue,
      siteAgreement,
      themeConfigValue,
      themeAgreement,
      defaultValue
    ].map(v => v));
  }

  /**
   * Find all page source files located in sourceDir
   *
   * @returns {Promise<void>}
   * @api private
   */

  async resolvePages () {
    // resolve pageFiles
    const patterns = this.siteConfig.patterns ? this.siteConfig.patterns : ['**/*.md'];
    patterns.push('!.mdpress', '!node_modules');

    if (this.siteConfig.dest) {
      // #654 exclude dest folder when dest dir was set in
      // sourceDir but not in '.mdpress'
      const outDirRelative = path.relative(this.sourceDir, this.outDir);
      if (!outDirRelative.includes('..')) {
        patterns.push('!' + outDirRelative);
      }
    }
    const pageFiles = sort(await globby(patterns, { cwd: this.sourceDir }));
    this.pageFiles = pageFiles;

    await Promise.all(pageFiles.map(async (relative) => {
      const filePath = path.resolve(this.sourceDir, relative);
      await this.addPage({ filePath, relative });
    }));
  }

  /**
   * Add a page
   *
   * @returns {Promise<void>}
   * @api public
   */

  async addPage (options) {
    options.permalinkPattern = this.siteConfig.permalink;
    options.extractHeaders = this.siteConfig.markdown && this.siteConfig.markdown.extractHeaders;
    const page = new Page(options, this);
    await page.process({
      markdown: this.markdown,
      computed: new this.ClientComputedMixinConstructor(),
      enhancers: this.pluginAPI.getOption('extendPageData').items
    });
    const index = this.pages.findIndex(({ path }) => path === page.path);
    if (index >= 0) {
      // Override a page if corresponding path already exists
      logger.warn(`Override existing page ${chalk.yellow(page.path)}.`);
      this.pages.splice(index, 1, page);
    } else {
      this.pages.push(page);
    }
  }

  /**
   * Get config value of current active theme.
   *
   * @param {string} key
   * @returns {any}
   * @api private
   */

  getThemeConfigValue (key) {
    return this.themeAPI.theme.entry[key]
      || this.themeAPI.existsParentTheme && this.themeAPI.parentTheme.entry[key];
  }

  /**
   * Resolve the absolute path of a theme-level agreement file,
   * return `undefined` when it doesn't exists.
   *
   * @param {string} filepath
   * @returns {string|undefined}
   */

  resolveThemeAgreementFile (filepath) {
    const current = path.resolve(this.themeAPI.theme.path, filepath);
    if (fs.existsSync(current)) {
      return current;
    }
    if (this.themeAPI.existsParentTheme) {
      const parent = path.resolve(this.themeAPI.parentTheme.path, filepath);
      if (fs.existsSync(parent)) {
        return parent;
      }
    }
  }

  /**
   * Resolve the absolute path of a site-level agreement file,
   * return `undefined` when it doesn't exists.
   *
   * @param {string} filepath
   * @returns {string|undefined}
   */

  resolveSiteAgreementFile (filepath) {
    return path.resolve(this.userDir, filepath);
  }

  /**
   * Get the data to be delivered to the client.
   *
   * @returns {{
   *  title: string,
   *  description: string,
   *  base: string,
   *  pages: Page[],
   *  themeConfig: ThemeConfig,
   *  locales: Locales
   * }}
   * @api public
   */

  getSiteData () {
    const { locales } = this.siteConfig;
    if (locales) {
      Object.keys(locales).forEach(path => {
        locales[path].path = path;
      });
    }

    return {
      title: this.siteConfig.title || '',
      description: this.siteConfig.description || '',
      base: this.base,
      headTags: this.siteConfig.head || [],
      pages: this.pages.map(page => page.toJson()),
      themeConfig: this.siteConfig.themeConfig || {},
      locales
    };
  }

  /**
   * Get file path in core lib
   *
   * @param relative
   * @returns {string}
   * @api public
   */

  getLibFilePath (relative) {
    return path.join(this.libDir, relative);
  }

  /**
   * Launch a dev process with current app context.
   *
   * @returns {Promise<App>}
   * @api public
   */

  async dev () {
    this.devProcess = new DevProcess(this);
    await this.devProcess.process();
    const error = await new Promise(resolve => {
      try {
        this.devProcess
          .on('fileChanged', ({ type, target }) => {
            console.log(`Reload due to ${chalk.red(type)} ${chalk.cyan(path.relative(this.sourceDir, target))}`);
            this.process();
          })
          .createServer()
          .listen(resolve);
      } catch (err) {
        resolve(err);
      }
    });
    if (error) {
      throw error;
    }
    return this;
  }

  /**
   * Launch a build process with current app context
   *
   * @returns {Promise<App>}
   * @api public
   */

  async build (removeMainfest = true) {
    this.buildProcess = new BuildProcess(this,removeMainfest);
    await this.buildProcess.process();
    await this.buildProcess.render();
    return this;
  }
};
