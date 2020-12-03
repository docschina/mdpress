const path = require('path');

// Theme API.
module.exports = (options, ctx) => {
  const { themeConfig, siteConfig } = ctx;

  // resolve algolia
  const isAlgoliaSearch = (
    themeConfig.algolia
        || Object
          .keys(siteConfig.locales && themeConfig.locales || {})
          .some(base => themeConfig.locales[base].algolia)
  );

  const enableSmoothScroll = themeConfig.smoothScroll === true;

  return {
    alias () {
      return {
        '@AlgoliaSearchBox': isAlgoliaSearch
          ? path.resolve(__dirname, 'components/AlgoliaSearchBox.js')
          : path.resolve(__dirname, 'noopModule.js')
      };
    },

    plugins: [
      ['@mdpress/active-header-links', options.activeHeaderLinks],
      '@mdpress/search',
      '@mdpress/plugin-nprogress',
      ['@mdpress/container', {
        paths: [
          path.resolve(__dirname,'markdown/tip-container.js'),
          path.resolve(__dirname,'markdown/warning-container.js'),
          path.resolve(__dirname,'markdown/danger-container.js'),
          path.resolve(__dirname,'markdown/details-container.js')
        ]
      }],
      ['smooth-scroll', enableSmoothScroll]
    ]
  };
};
