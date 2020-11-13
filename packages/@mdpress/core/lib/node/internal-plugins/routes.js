module.exports = (options, ctx) => ({
  name: '@mdpress/internal-routes',

  // @internal/routes
  async clientDynamicModules () {
    const { pages,globalLayout } = ctx;
    const code = importCode(globalLayout) + routesCode(pages);
    return { name: 'routes.js', content: code, dirname: 'internal' };
  }
});

/**
 * Import utilities
 * @param {string} globalLayout path of global layout component
 * @returns {string}
 */
function importCode (globalLayout) {
  return `
import GlobalLayout from ${JSON.stringify(globalLayout)}
`;
}

/**
 * Get routes config code.
 * @param {array} pages
 * @returns {string}
 */
function routesCode (pages) {
  function genRoute ({
    path: pagePath,
    key: componentName,
    // frontmatter: {
    //   layout
    // },
    regularPath,
    _meta
  },needComp = true) {
    let code = needComp ? `
  {
    name: ${JSON.stringify(componentName)},
    path: ${JSON.stringify(pagePath)},
    component: GlobalLayout,
    ${_meta ? `\n    meta: ${JSON.stringify(_meta)}` : ''}
  }` : `\n{
    name: ${JSON.stringify(componentName)},
    path: ${JSON.stringify(pagePath)}
 }`;

    const dncodedPath = decodeURIComponent(pagePath);
    if (dncodedPath !== pagePath) {
      code += `,
  {
    path: ${JSON.stringify(dncodedPath)},
    redirect: ${JSON.stringify(pagePath)}
  }`;
    }

    if (/\/$/.test(pagePath)) {
      code += `,
  {
    path: ${JSON.stringify(pagePath + 'index.html')},
    redirect: ${JSON.stringify(pagePath)}
  }`;
    }

    const decodedRegularPath = decodeURIComponent(regularPath);

    if (decodedRegularPath !== pagePath) {
      code += `,
  {
    path: ${JSON.stringify(decodedRegularPath)},
    redirect: ${JSON.stringify(pagePath)}
  }`;
    }

    return code;
  }

  const notFoundRoute = `,
  {
    path: '*',
    component: GlobalLayout
  }`;

  return (
    `export const $routes = [${pages.map(item => genRoute(item,false)).join(',')}\n]\n` +
    `export const routes = [${pages.map(item => genRoute(item,true)).join(',')}${notFoundRoute}\n]`
  );
}