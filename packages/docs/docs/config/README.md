---
sidebarDepth: 3
sidebar: auto
---

# Config Reference



## Basic Config

### base

- Type: `string`
- Default: `/`

The base URL the site will be deployed at. You will need to set this if you plan to deploy your site under a sub path, for example, GitHub pages. If you plan to deploy your site to `https://foo.github.io/bar/`, then you should set `base` to `"/bar/"`. It should always start and end with a slash.

The `base` is automatically prepended to all the URLs that start with `/` in other options, so you only need to specify it once.

**Also see:**

- [Base URL](../guide/assets.md#base-url)
- [Deploy Guide > GitHub Pages](../guide/deploy.md#github-pages)

### title

- Type: `string`
- Default: `undefined`

Title for the site. This will be the prefix for all page titles, and displayed in the navbar in the default theme.

### description

- Type: `string`
- Default: `undefined`

Description for the site. This will render as a `<meta>` tag in the page HTML.

### head

- Type: `Array`
- Default: `[]`

Extra tags to inject into the page HTML `<head>`. You can specify each tag in the form of `[tagName, { attrName: attrValue }, innerHTML?]`. For example, to add a custom favicon:

``` js
module.exports = {
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }]
  ]
}
```

### host

- Type: `string`
- Default: `'0.0.0.0'`

Specify the host to use for the dev server.

### port

- Type: `number`
- Default: `8080`

Specify the port to use for the dev server.

### temp

- Type: `string`
- Default: `/path/to/@mdpress/core/.temp`


Specify the temporary directory for client.

### dest

- Type: `string`
- Default: `.mdpress/dist`

Specify the output directory for `mdpress build`. If a relative path is specified, it will be resolved based on `process.cwd()`.

### locales

- Type: `{ [path: string]: Object }`
- Default: `undefined`

Specify locales for i18n support. For more details, see the guide on [Internationalization](../guide/i18n.md).

### shouldPrefetch

- Type: `Function`
- Default: `() => true`

A function to control what files should have `<link rel="prefetch">` resource hints generated. 

### cache

- Type: `boolean|string`
- Default: `true`

MdPress uses [cache-loader](https://github.com/webpack-contrib/cache-loader) by default to greatly speed up the compilation of webpack.

You can use this option to specify the path to the cache, and can also remove the cache before each build by setting it to `false`.

::: tip
You can also use this option through the CLI:

```bash
mdpress dev docs --cache .cache # set cache path
mdpress dev docs --no-cache     # remove cache before each build.
```
:::

### extraWatchFiles

- Type: `Array`
- Default: `[]`

Specify extra files to watch.

You can watch any file if you want. File changes will trigger `mdpress` rebuilding and real-time updates.

``` js
module.exports = {
  extraWatchFiles: [
    '.mdpress/foo.js', // Relative path usage
    '/path/to/bar.js'   // Absolute path usage
  ]
}
```

### patterns

- Type: `Array`
- Default: `['**/*.md', '**/*.js']`

Specify which pattern of files you want to be resolved.

## Styling

### palette.styl

To apply simple overrides to the styling of the [default preset](https://github.com/docschina/mdpress/blob/master/packages/@mdpress/core/lib/client/style/config.styl) or define some variables to use later, you can create a `.mdpress/styles/palette.styl` file.

There are some predefined variables you can tweak:

``` stylus
// colors
$accentColor = #3eaf7c
$textColor = #2c3e50
$borderColor = #eaecef
$codeBgColor = #282c34
$arrowBgColor = #ccc
$badgeTipColor = #42b983
$badgeWarningColor = darken(#ffe564, 35%)
$badgeErrorColor = #DA5961

// layout
$navbarHeight = 3.6rem
$sidebarWidth = 20rem
$contentWidth = 740px
$homePageWidth = 960px

// responsive breakpoints
$MQNarrow = 959px
$MQMobile = 719px
$MQMobileNarrow = 419px
```

::: danger Note
You should ONLY define variables in this file. Since `palette.styl` will be imported at the end of the root Stylus config file, as a config, several files will use it, so once you wrote styles here, your style would be duplicated by multiple times.
:::

### index.styl

MdPress provides a convenient way to add extra styles. You can create a `.mdpress/styles/index.styl` file for that. This is a [Stylus](http://stylus-lang.com/) file but you can use normal CSS syntax as well.

```stylus
.content {
  font-size 30px
}
```

**Also see:**

- [Why can’t `palette.styl` and `index.styl` merge into one API?](../faq/README.md#why-can-t-palette-styl-and-index-styl-merge-into-one-api)

## Theming

### theme

- Type: `string`
- Default: `undefined`

Specify this to use a custom theme.

**Also see:**

- [Using a theme](../theme/using-a-theme.md).

### themeConfig

- Type: `Object`
- Default: `{}`

Provide config options to the used theme. The options will vary depending on the theme you are using.

**Also see:**

- [Default Theme Configuration](../theme/default-theme-config.md).

## Pluggable

### plugins

- Type: `Object|Array`
- Default: `undefined`

Please check out [Plugin > Using a plugin](../plugin/using-a-plugin.md) to learn how to use a plugin.

## Markdown
Markdown is divided into Node and client configuration. [Client configuration](../guide/basic-config.html##app-level-enhancements) needs to be done in `enhanceApp`.

### markdown.lineNumbers<Badge text="client"/>

- Type: `boolean`
- Default: `undefined`

Whether to show line numbers to the left of each code blocks.

**Also see:**

- [Line Numbers](../guide/markdown.md#line-numbers)

### markdown.slugify<Badge text="client"/>

- Type: `Function`
- Default: [source](https://github.com/docschina/mdpress/tree/master/packages/@mdpress/shared-utils/src/slugify.ts)

Function for transforming [header](../miscellaneous/glossary.md#headers) texts into slugs. Changing this affects the ids/links generated for header anchors, [table of contents](../guide/markdown.md#table-of-contents) and [sidebar](../theme/default-theme-config.md#sidebar) links.

### markdown.anchor<Badge text="client"/>

- Type: `Object`
- Default: `{ permalink: true, permalinkBefore: true, permalinkSymbol: '#' }`

Options for [markdown-it-anchor](https://github.com/valeriangalliat/markdown-it-anchor). (Note: prefer `markdown.slugify` to customize header ids.)

### markdown.externalLinks<Badge text="client"/>

- Type: `Object`
- Default: `{ target: '_blank', rel: 'noopener noreferrer' }`

The key and value pair will be added to `<a>` tags that point to an external link. The default option will open external links in a new window.

### markdown.toc<Badge text="client"/>

- Type: `Object`
- Default: `{ includeLevel: [2, 3] }`

Options for [markdown-it-table-of-contents](https://github.com/Oktavilla/markdown-it-table-of-contents). (Note: prefer `markdown.slugify` to customize header ids.)

### markdown.extendMarkdown<Badge text="client"/>

- Type: `Function`
- Default: `undefined`

A function to edit default config or apply extra plugins to the [markdown-it](https://github.com/markdown-it/markdown-it) instance used to render source files. For example:

``` js
module.exports = {
  markdown: {
    extendMarkdown: md => {
      md.set({ breaks: true })
      md.use(require('markdown-it-xxx'))
    }
  }
}
```

::: tip
This option is also included in [Plugin API](../plugin/option-api.md#extendmarkdown).
:::

### markdown.extractHeaders<Badge text="node"/>

- Type: `Array`
- Default: `['h2', 'h3']`

While preparing the page, headers are extracted from the Markdown file and stored in `this.$page.headers`. By default, MdPress will extract `h2` and `h3` elements for you. You can override the headers it pulls out in your `markdown` options.
 
``` js
module.exports = {
  markdown: {
    extractHeaders: [ 'h2', 'h3', 'h4' ]
  }
}
```

## Build Pipeline

:::tip Configuring CSS Pre-processors
MdPress comes with built-in webpack config for the CSS pre-processors listed below. For more information on installation these or pre-processors without built-in support, see [Using Pre-Processors](../guide/using-react.md#using-pre-processors) for more information.
:::

### postcss

- Type: `Object`
- Default: `{ plugins: [require('autoprefixer')] }`

Options for [postcss-loader](https://github.com/postcss/postcss-loader). Note specifying this value will overwrite autoprefixer and you will need to include it yourself.

### Stylus

- Type: `Object`
- Default: `{ preferPathResolver: 'webpack' }`

Options for [stylus-loader](https://github.com/shama/stylus-loader).

### scss

- Type: `Object`
- Default: `{}`

Options for [sass-loader](https://github.com/webpack-contrib/sass-loader) to load `*.scss` files.

### Sass

- Type: `Object`
- Default: `{ indentedSyntax: true }`

Options for [sass-loader](https://github.com/webpack-contrib/sass-loader) to load `*.sass` files.

### less

- Type: `Object`
- Default: `{}`

Options for [less-loader](https://github.com/webpack-contrib/less-loader).

### configureWebpack

- Type: `Object | Function`
- Default: `undefined`

Edit the internal webpack config. If the value is an Object, it will be merged into the final config using [webpack-merge](https://github.com/survivejs/webpack-merge); If the value is a function, it will receive the config as the 1st argument and an `isServer` flag as the 2nd argument. You can either mutate the config directly, or return an object to merge:

``` js
module.exports = {
  configureWebpack: (config, isServer) => {
    if (!isServer) {
      // mutate the config for client
    }
  }
}
```

### chainWebpack

- Type: `Function`
- Default: `undefined`

Edit the internal webpack config with [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain).

``` js
module.exports = {
  chainWebpack: (config, isServer) => {
    // config is an instance of ChainableConfig
  }
}
```