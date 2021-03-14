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
        containers: [{
          type: 'danger',
          defaultTitle: {
            '/': 'WARNING',
            '/zh/': '警告'
          }
        },{
          type: 'tip',
          defaultTitle: {
            '/': 'TIP',
            '/zh/': '提示'
          }
        },{
          type: 'warning',
          defaultTitle: {
            '/': 'WARNING',
            '/zh/': '注意'
          }
        },{
          type: 'details',
          before: info => `<details class="custom-block details">${info ? `<summary>${info}</summary>` : ''}\n`,
          after: () => '</details>\n'
        }]
      }],
      ['smooth-scroll', enableSmoothScroll]
    ]
  };
};
