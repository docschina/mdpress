# Configuration

## Config File

Without any configuration, the page is pretty minimal, and the user has no way to navigate around the site. To customize your site, let’s first create a `.mdpress` directory inside your docs directory. This is where all MdPress-specific files will be placed in. Your project structure is probably like this:

```
.
├─ docs
│  ├─ README.md
│  └─ .mdpress
│     └─ config.js
└─ package.json
```

The essential file for configuring a MdPress site is `.mdpress/config.js`, which should export a JavaScript object:

``` js
module.exports = {
  title: 'Hello MdPress',
  description: 'Just playing around'
}
```

If you’ve got the dev server running, you should see the page now has a header with the title and a search box. MdPress comes with built-in headers-based search - it automatically builds a simple search index from the title, `h2` and `h3` headers from all the pages.

Check out the [Config Reference](../config/README.md) for a full list of options.

::: tip Alternative Config Formats
You can also use YAML (`.mdpress/config.yml`) or TOML (`.mdpress/config.toml`) formats for the configuration file.
:::

## Theme Configuration

A MdPress theme owns all the layout and interactivity details of your site. MdPress ships with a default theme (you are looking at it right now), designed for technical documentation. It exposes many options that allow you to customize the navbar, sidebar and homepage, etc. For details, check out the [Default Theme Config](../theme/default-theme-config.md) page.

To develop a custom theme, see [Writing a theme](../theme/writing-a-theme.md).

## App Level Enhancements

Since the MdPress app is a standard React app, you can apply app-level enhancements by creating a file `.mdpress/enhanceApp.js`, which will be imported into the app if it’s present. The file should `export default` a hook function which will receive an object containing some app-level values. You can use this hook to install extra React Component, register global components, or modify router:

``` js
// async function is also supported, too
export default ({
  sandbox, // the sandbox of React component being used in the MdPress app
  routes, // the router option for the app
  siteData, // site metadata
  isServer, // is this enhancement applied in server-rendering or client
  mdConfig, // the markdown extra config for the app
  hooks, // some hooks for the root instance
}) => {
  // ...apply enhancements to the app
}
```

**Related:**

- [App Level Enhancements in Plugin API](../plugin/option-api.md#enhanceappfiles)
