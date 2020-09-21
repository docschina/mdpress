const {
  fs,
  path,
  codegen: { pathsToModuleCode }
} = require('@mdpress/shared-utils');

let moduleId = 0;
let manifest = [];
const ContainerPlugin = (options = {},ctx) => {
  if (Array.isArray(options.paths)){
    options.paths.forEach(async item => {
      const content = fs.readFileSync(item);
      const destPath = await ctx.writeTemp(
        `markdown-container/${moduleId++}.js`,
        hasDefaultExport
          ? content
          : content + '\nexport default {}'
      );
      if (destPath) {
        manifest.push(destPath);
      }
    });
  }

  return {
    name: 'mdpress-plugin-container',
    multiple: true,
    async: true,
    async clientDynamicModules () {
      return { name: 'markdown-container.js', content: pathsToModuleCode(manifest), dirname: 'internal' };
    },
    enhanceAppFiles: path.resolve(__dirname, 'enhanceAppFile.js')
  };
};

function hasDefaultExport (content) {
  return content.includes('export default') || content.includes('module.exports');
}

module.exports = ContainerPlugin;