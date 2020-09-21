const { fs } = require('@mdpress/shared-utils');

module.exports = (options) => ({
  define: {
    AHL_SIDEBAR_LINK_SELECTOR: options.sidebarLinkSelector || '.sidebar-link',
    AHL_HEADER_ANCHOR_SELECTOR: options.headerAnchorSelector || '.header-anchor'
  },
  async clientDynamicModules () {
    const code = fs.readFileSync(__dirname + '/activeHeaderLinks.js');

    return { name: 'activeHeaderLinks.js', content: code, dirname: 'internal/hooks' };
  }
});
