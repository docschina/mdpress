# Option API

## name

- Type: `string`
- Default: undefined

The name of the plugin.

Internally, MdPress will use the plugin’s package name as the plugin name. When your plugin is a local plugin (that is using a pure plugin function directly), please be sure to configure this option, that is good for debug tracking.

```js
// .mdpress/config.js
module.exports = {
  plugins: [
    [
      (pluginOptions, context) => ({
        name: 'my-xxx-plugin'
        // ... the rest of options
      })
    ]
  ]
}
```

## plugins

- Type: `array`
- Default: `undefined`

A plugin can contain several plugins like a preset.

```js
// A plugin
module.exports = {
  plugins: [
    'tag',
    'category'
  ]
}
```

## chainWebpack

- Type: `Function`
- Default: undefined

Edit the internal webpack config with [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain).

```js
module.exports = {
  chainWebpack (config, isServer) {
    // config is an instance of ChainableConfig
  }
}
```

::: tip
Since MdPress is a SSR based application, there needs to be two webpack configurations, `isServer` is used to determine whether the current webpack config is applied to the server or client.

## define

- Type: `Object|Function`
- Default: undefined

Since using [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) via [chainWebpack](#chainwebpack) would be a little complicated:

```js
module.exports = {
  chainWebpack (config) {
    config.plugin('injections').tap(([options]) => [
      Object.assign(options, {
        SW_BASE_URL: JSON.stringify('/')
      })
    ])
  }
}
```

MdPress opened up a more concise `define` option, note that the values has been automatically processed by `JSON.stringify`.

- Object Usage:

```js
module.exports = {
  define: {
    SW_BASE_URL: '/',
  }
}
```

- Function Usage:

```js
module.exports = (options, context) => ({
  define () {
    return {
      SW_BASE_URL: context.base || '/',
      SW_ENABLED: !!options.enabled,
    }
  }
})
```

## alias

- Type: `Object|Function`
- Default: undefined

We can set aliases via [chainWebpack](#chainwebpack):

```js
module.exports = (options, context) => ({
  chainWebpack (config) {
    config.resolve.alias.set('@pwd', process.cwd())
  }
})
```

But `alias` option makes this process more like configuration:

```js
module.exports = (options, context) => ({
  alias: {
    '@pwd': process.cwd()
  }
})
```

## beforeDevServer

- Type: `Function`
- Default: undefined

Equivalent to [before](https://webpack.js.org/configuration/dev-server/#devserver-before) in [webpack-dev-server](https://github.com/webpack/webpack-dev-server). You can use it to define custom handlers before all middleware is executed:

```js
module.exports = {
  // ...
  beforeDevServer(app, server) {
    app.get('/path/to/your/custom', function(req, res) {
      res.json({ custom: 'response' })
    })
  }
}
```

## afterDevServer

- Type: `Function`
- Default: undefined

Equivalent to [after](https://webpack.js.org/configuration/dev-server/#devserver-after) in [webpack-dev-server](https://github.com/webpack/webpack-dev-server). You can use it to execute custom middleware after all other middleware:

```js
module.exports = {
  // ...
  afterDevServer(app, server) {
    // hacking now ...
  }
}
```

## enhanceAppFiles

- Type: `String | Array | AsyncFunction`
- Default: `undefined`

This option accepts absolute file path(s) pointing to the enhancement file(s), or a function that returns the path(s), which allows you to do some [App Level Enhancements](../guide/basic-config.md#app-level-enhancements).

``` js
import { resolve } from 'path'

module.exports = {
  enhanceAppFiles: resolve(__dirname, 'client.js')
}
```

This option also supports dynamic code which allows you to do more, with the ability to touch the compilation context:

```js
module.exports = (option, context) => {
  return {
    enhanceAppFiles() {
      return {
         name: 'dynamic-code',
         content: `export default ({ }) => { }`
       }
    }
  }
}
```

## clientDynamicModules

- Type: `Function`
- Default: `undefined`

Sometimes, you may want to generate some client modules at compile time.

```js
module.exports = (options, context) => ({
  clientDynamicModules() {
    return {
      name: 'constants.js',
      content: `export const SOURCE_DIR = '${context.sourceDir}'`
    }
  }
})
```

Then you can use this module at client-side code by:

``` js
import { SOURCE_DIR } from '@dynamic/constants'
```

## extendPageData

- Type: `Function|AsyncFunction`
- Default: `undefined`

A function used to extend or edit the [$page](../guide/global-computed.md#page) object. This function will be invoking once for each page at compile time.

```js
module.exports = {
  extendPageData ($page) {
    const {
      _filePath,           // file's absolute path
      _computed,           // access the client global computed mixins at build time, e.g _computed.$localePath.
      _content,            // file's raw content string
      _strippedContent,    // file's content string without frontmatter
      key,                 // page's unique hash key
      frontmatter,         // page's frontmatter object
      regularPath,         // current page's default link (follow the file hierarchy)
      path,                // current page's real link (use regularPath when permalink does not exist)
    } = $page

    // 1. Add extra fields.
    $page.xxx = 'xxx'

    // 2. Change frontmatter.
    frontmatter.sidebar = 'auto'
  }
}
```

Note that `extendPageData` can also be defined as an asynchronous function.

```js
module.exports = {
  async extendPageData ($page) {
    $page.xxx = await getAsyncData()
  }
}
```

::: warning Note
These fields starting with an `_` means you can only access them during build time.
:::

For example:

``` js
module.exports = {
  extendPageData ($page) {
    $page.size = ($page._content.length / 1024).toFixed(2) + 'kb'
  }
}
```

Then you can use this value via `$page.size` in sandbox React Component.

## additionalPages

- Type: `Array|AsyncFunction`
- Default: `undefined`

Add a page pointing to a Markdown file:

```js
const path = require('path')

module.exports = {
  additionalPages: [
    {
     path: '/readme/',
     filePath: path.resolve(__dirname, '../../README.md')
    }
  ]
}
```

Add a page with explicit content:

```js
module.exports = {
  async additionalPages () {
    // Note that MdPress doesn't have request library built-in
    // you need to install it yourself.
    const rp = require('request-promise')
    const content = await rp('https://raw.githubusercontent.com/LinFeng1997/mdpress/master/CHANGELOG.md')
    return [
      {
        path: '/changelog/',
        content
      }
    ]
  }
}
```

Add a pure route:

```js
module.exports = {
  additionalPages: [
    {
       path: '/alpha/',
       frontmatter: {
          layout: 'MyLayout'
       }
    }
  ]
}
```

## globalUIComponents

- Type: `Array|String`
- Default: `undefined`

You might want to inject some global UI fixed somewhere on the page, for example `BackToTop`, `Popup`. In MdPress, **a global UI is a React component**, you can directly define the component’s name(s) in this option, for example:

``` js
module.exports = {
  globalUIComponents: [
    'Component1',
    'Component2'
  ]
}
```

Then, MdPress will automatically inject these components behind the layout component:

```html
<div id="app">
  <div class="theme-container"> ... </div> <!-- Layout Component -->
  <div class="global-ui">
    <Component1/>
    <Component2/>
  </div>
</div>
```

## extendCli

- Type: `function`
- Default: `undefined`

Register a extra command to enhance the CLI of MdPress. The function will be called with a [CAC](https://github.com/cacjs/cac)'s instance as the first argument.

```js
module.exports = {
  extendCli (cli) {
    cli
      .command('info [targetDir]', '')
      .option('--debug', 'display info in debug mode')
      .action((dir = '.') => {
        console.log('Display info of your website')
      })
  }
}
```

Now you can use `mdpress info [targetDir]` a in your project!

::: tip
Note that a custom command registered by a plugin requires MdPress to locate your site configuration like `mdpress dev` and `mdpress build`, so when developing a command, be sure to lead the user to pass `targetDir` as an CLI argument.
:::
