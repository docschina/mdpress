const { path } = require('@mdpress/shared-utils');

module.exports = (options, context) => ({
  name: '@mdpress/internal-enhance-app',

  enhanceAppFiles () {
    const { sourceDir, themeAPI } = context;
    const enhanceAppPath = path.resolve(sourceDir, '.mdpress/enhanceApp.js');
    const files = [enhanceAppPath];
    if (themeAPI.existsParentTheme) {
      files.push(path.resolve(themeAPI.parentTheme.path, 'enhanceApp.js'));
    }
    const themeEnhanceAppPath = path.resolve(themeAPI.theme.path, 'enhanceApp.js');
    files.push(themeEnhanceAppPath);
    return files;
  }
});

