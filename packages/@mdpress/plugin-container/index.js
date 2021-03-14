const {
  fs,
  path,
  codegen: { pathsToModuleCode }
} = require('@mdpress/shared-utils');

let moduleId = 0;
let manifest = [];
const ContainerPlugin = (options = {},ctx) => {
  fs.emptyDirSync(path.resolve(ctx.tempPath, 'markdown-container'));

  if (Array.isArray(options.containers)) {
    let functionKeys = [];

    const replacer = (key, value) => {
      if (typeof value === 'function') {
        functionKeys.push(key);
        return value.toString();
      }
      return value;
    };

    options.containers.forEach(async item => {
      let content = `export default ${JSON.stringify({
        ...item,
        functionKeys
      }, replacer,2)}`;

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