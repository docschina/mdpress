# Writing a theme

To write a theme, create a `.mdpress/theme` directory in your docs root, and then create a `Layout.js` file:

::: file
.
└─ .mdpress
   └─ `theme`
       └─ Layout.js
:::

From there it’s the same as developing a normal React application. It’s entirely up to you how to organize your theme.

## Content Outlet

The compiled content of the current `.md` file being rendered will be available as a special `<Content/>` global component. You will need to render it somewhere in your layout to display the content of the page. The simplest theme can be a single `Layout.js` component with the following content:

``` html
<template>
  <div class="theme-container">
    <Content/>
  </div>
</template>
```

**Also see:**

- [Markdown Slot](../guide/markdown-slot.md)

## Directory Structure

One `Layout.js` might not be enough, and you might also want to define more layout components in the theme for using on different pages. You may also want to customize the [palette](../config/README.md#palette-styl), and even apply some plugins.

So it’s time to reorganize your theme, an agreed theme directory structure is as follows:

::: file
theme
├── `sandbox`
│   └── xxx.js
├── `components`
│   └── xxx.js
├── `layouts`
│   ├── Layout.js_(**Mandatory**)_
│   └── 404.js
├── `styles`
│   ├── index.styl
│   └── palette.styl
├── `templates`
│   ├── dev.html
│   └── ssr.html
├── `index.js`
├── `enhanceApp.js`
└── package.json
:::

- `theme/sandbox`: The components in this directory will be automatically registered as sandbox components for Markdown.
- `theme/components`: Your components.
- `theme/layouts`: Layout components of the theme, where `Layout.js` is required.
- `theme/styles`: Global style and palette.
- `theme/templates`: Edit default template.
- `theme/index.js`: Entry file of theme configuration.
- `theme/enhanceApp.js`: Theme level enhancements.

::: warning Note
When you publish your theme as an npm package, if you don’t have any theme configuration, that means you don’t have `theme/index.js`, you’ll need to set the `"main"` field  to `layouts/Layout.js` in `package.json`, only in this way MdPress can properly resolve the theme.
```json
{
  ...
  "main": "layouts/Layout.js",
  ...
}
```

:::

## Layout Component

Suppose your theme layouts folder is as follows:

::: file
theme
└── `layouts`
    ├── Layout.js
    ├── AnotherLayout.js
    └── 404.js
:::

Then, all the pages will use `Layout.js` as layout component by default, while the routes not matching will use `404.js`.

To switch the layout of some pages to `AnotherLayout.js`, all you have to do is update the frontmatter of this page:

```markdown
---
layout: AnotherLayout
---
````

::: tip
Each layout component may render distinct pages. To apply some global UI (for example global header), consider using [globalLayout](./option-api.md#globallayout)。
:::

## Apply plugins

You can apply some plugins to the theme via `theme/index.js`.

```js
module.exports = {
  plugins: [
    ['@mdpress/pwa', {
      serviceWorker: true,
      updatePopup: true
    }]
  ]
}
```

## Site and Page Metadata

The `Layout` component will be invoked once for every `.md` file in `docs`, and the metadata for the entire site and that specific page will be exposed respectively as `$site` and `$page` properties which are injected into every sandbox component in the app.

This is the value of `$site` of this website:

``` json
{
  "title": "MdPress",
  "description": "Markdown-powered Static Site Generator",
  "base": "/",
  "pages": [
    {
      "lastUpdated": 1524027677000,
      "path": "/",
      "title": "MdPress",
      "frontmatter": {}
    },
    ...
  ]
}
```

`title`, `description` and `base` are copied from respective fields in `.mdpress/config.js`. `pages` contains an array of metadata objects for each page, including its path, page title (explicitly specified in [YAML frontmatter](../guide/markdown.md#front-matter) or inferred from the first header on the page), and any YAML frontmatter data in that file.

This is the `$page` object for this page you are looking at:

``` json
{
  "lastUpdated": 1524847549000,
  "path": "/guide/custom-themes.html",
  "title": "Custom Themes",
  "headers": [/* ... */],
  "frontmatter": {}
}
```

If the user provided `themeConfig` in `.mdpress/config.js`, it will also be available as `$site.themeConfig`. You can use this to allow users to customize behavior of your theme - for example, specifying categories and page order. You can then use these data together with `$site.pages` to dynamically construct navigation links.

::: tip
  `lastUpdated` is the UNIX timestamp of this file’s last git commit, for more details, check out [Last Updated](../theme/default-theme-config.md#last-updated).
:::

## Content Excerpt

If a Markdown file contains a `<!-- more -->` comment, any content above the comment will be extracted and exposed as `$page.excerpt`. If you are building custom theme for blogging, this data can be used to render a post list with excerpts.

## App Level Enhancements

Themes can enhance the React app that MdPress uses by exposing an `enhanceApp.js` file at the root of the theme. The file should `export default` a hook function which will receive an object containing some app-level values. You can use this hook to install extra React Component, register global components, or modify router:

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
