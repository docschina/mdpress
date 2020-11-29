const { extname } = require('path');
const CSS_FILE_EXTENSIONS = ['.css', '.scss', '.sass', '.less','.styl','.stylus'];

module.exports = () => {
  return {
    visitor: {
      ImportDeclaration(path) {
        const { specifiers, source } = path.node;
        const { value } = source;
        if (
          specifiers.length > 0
                    && CSS_FILE_EXTENSIONS.includes(extname(value))
        ) {
          source.value = `${value}?module`;
        }
      },
    },
  };
};