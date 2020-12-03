# Plugin

Plugins generally add global-level functionality to MdPress. There is no strictly defined scope for a plugin. 

## Examples

There are typically several types of plugins:

1. Extend the page’s metadata generated at compile time. For example [@mdpress/plugin-last-updated](./official/plugin-last-updated.md);
2. Generate extra files before or after compilation. For example [@mdpress/plugin-pwa](./official/plugin-pwa.md);
3. Inject global UI. For example [@mdpress/plugin-back-to-top](./official/plugin-back-to-top.md);
4. Extend the CLI with custom commands. For example [mdpress-plugin-export](https://github.com/ulivz/mdpress-plugin-export).

Here is also a little slightly complicated plugin example [@mdpress/plugin-blog](https://mdpress-plugin-blog.ulivz.com) that uses compile-time metadata to generate some dynamic modules and initialize them on the client-side by using `enhanceAppFiles`.

## Out of the Box

To keep things at a minimum, not all of the official plugins are shipped with MdPress. Here is the list of plugins that are pre-installed in the MdPress and the default theme, **plugins that are not in the list below need to be installed manually**(e.g. [@mdpress/plugin-back-to-top](./official/plugin-back-to-top.md)).

### Plugins that come with MdPress

- [@mdpress/plugin-last-updated](./official/plugin-last-updated.md)
- [@mdpress/plugin-register-components](./official/plugin-register-components.md)

### Plugins that come with the default theme

- [@mdpress/plugin-active-header-links](./official/plugin-active-header-links.md)
- [@mdpress/plugin-nprogress](./official/plugin-nprogress.md)
- [@mdpress/plugin-search](./official/plugin-search.md)
- [mdpress-plugin-container](https://mdpress.github.io/plugins/container/)
- [mdpress-plugin-smooth-scroll](https://mdpress.github.io/plugins/smooth-scroll/)

## Architecture

The architecture of the whole plugin system is as follows:

![Architecture of MdPress](/architecture.png)
