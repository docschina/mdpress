---
metaTitle: Option API | Plugin
---

# Option API

## name

- 类型: `string`
- 默认值: undefined

插件的名字。

在内部，MdPress 将会使用插件的包名作为插件的名称。当你的插件是一个本地插件（即直接使用了一个纯函数）时，请确保设定了该选项，这对调试更有利。

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

- 类型: `array`
- 默认值: undefined

一个插件可以像 preset 一样包含多个插件。

```js
// 一个插件
module.exports = {
  plugins: [
    'tag',
    'category'
  ]
}
```

## chainWebpack

- 类型: `Function`
- 默认值: undefined

使用 [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain) 来修改内部的 webpack 配置：

```js
module.exports = {
  chainWebpack (config, isServer) {
    // config 是一个 ChainableConfig 的实例
  }
}
```

::: tip 提示
由于 MdPress 是一个基于 SSR 的应用，这里会有两个 webpack 配置，`isServer` 用于决定当前的 webpack 配置是应用到 server 还是 client。

:::

## define

- 类型: `Object|Function`
- 默认值: undefined

由于通过 [chainWebpack](#chainwebpack) 使用 [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) 会有点麻烦：

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

MdPress 特别开辟了一个更简洁的 `define` 选项。值得注意的是这些值已自动地被 `JSON.stringify` 处理。

- 对象式:

```js
module.exports = {
  define: {
    SW_BASE_URL: '/',
  }
}
```

- 函数式:

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

- 类型: `Object|Function`
- 默认值: undefined

我们可以通过 [chainWebpack](#chainwebpack) 来配置别名：

```js
module.exports = (options, context) => ({
  chainWebpack (config) {
    config.resolve.alias.set('@pwd', process.cwd())
  }
})
```

`alias` 可以使这个流程更像配置：

```js
module.exports = (options, context) => ({
  alias: {
    '@theme': context.themeAPI.themePath
  }
})
```

## beforeDevServer

- 类型: `Function`
- 默认值: undefined

等同于 [webpack-dev-server](https://github.com/webpack/webpack-dev-server) 中的 [before](https://webpack.js.org/configuration/dev-server/#devserver-before) 选项，你可以使用它来自定义你的 devServer，如：

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

- 类型: `Function`
- 默认值: undefined

等同于 [webpack-dev-server](https://github.com/webpack/webpack-dev-server) 中的 [after](https://webpack.js.org/configuration/dev-server/#devserver-after)，你可以用其在所有中间件的最后去执行一些自定义的中间件：

```js
module.exports = {
  // ...
  afterDevServer(app, server) {
    // hacking now ...
  }
}
```

## enhanceAppFiles

- 类型: `String | Array | AsyncFunction`
- 默认值: `undefined`

此选项接受指向增强文件的绝对文件路径或返回该路径的函数，你可以通过此选项做一些[应用级别的配置](../guide/basic-config.md#应用级别的配置):

``` js
import { resolve } from 'path'

module.exports = {
  enhanceAppFiles: resolve(__dirname, 'client.js')
}
```

此选项还支持动态代码，允许你使用贴近编译上下文的能力来做更多的事：

```js
module.exports = (option, context) => {
  return {
    enhanceAppFiles() {
      return {
         name: 'dynamic-code',
         content: `export default () => { }`
       }
    }
  }
}
```

## clientDynamicModules

- 类型: `Function`
- 默认值: `undefined`

有时，你可能想要在编译期间生成一些在客户端使用的模块：

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

然后你可以在客户端这样使用你的模块：

``` js
import { SOURCE_DIR } from '@dynamic/constants'
```

## extendPageData

- 类型: `Function`
- 默认值: `undefined`

一个函数，用于拓展或者修改 [$page](../guide/global-computed.md#page) 对象。这个函数将会在编译器为每个页面执行一次。

```js
module.exports = {
  extendPageData ($page) {
    const {
      _filePath,           // 源文件的绝对路径
      _computed,           // 在构建期访问全局的计算属性，如：_computed.$localePath.
      _content,            // 源文件的原始内容字符串
      _strippedContent,    // 源文件剔除掉 frontmatter 的内容字符串
      key,                 // 页面唯一的 hash key
      frontmatter,         // 页面的 frontmatter 对象
      regularPath,         // 当前页面遵循文件层次结构的默认链接
      path,                // 当前页面的实际链接（在 permalink 不存在时，使用 regularPath ）
    } = $page

    // 1. Add extra fields.
    $page.xxx = 'xxx'

    // 2. Change frontmatter.
    frontmatter.sidebar = 'auto'
  }
}
```

::: warning 注意
那些以 `_` 开头的字段意味着你只能在编译期访问。
:::

例子：

``` js
module.exports = {
  extendPageData ($page) {
    $page.size = ($page._content.length / 1024).toFixed(2) + 'kb'
  }
}
```

然后你可以在任意的 React 组件中通过 `useData` 钩子和 `$page.size` 来访问这个变量。

## additionalPages

- 类型: `Array|AsyncFunction`
- 默认值: `undefined`

增加一个指向某个 markdown 文件的页面：

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

或增加一个具有明确内容的页面：

```js
module.exports = {
  async additionalPages () {
    // 注意 MdPress 没有任何内置的请求库，
    // 你需要自己安装它。
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

或增加一个纯粹的路由：

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

- 类型: `Array|String`
- 默认值: `undefined`

你可能想注入某些全局的 UI，并固定在页面中的某处，如  `BackToTop`, `Popup`。在 MdPress 中，**一个全局 UI 就是一个 React 组件**。你可以直接配置该全局组件的名称，如：

``` js
module.exports = {
  globalUIComponents: [
    'Component1',
    'Component2'
  ]
}
```

MdPress 将会自动将这些组件注入到布局组件的隔壁：

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

- 类型: `function`
- 默认值: `undefined`

注册一个额外的 command 来增强 MdPress 的 CLI。这个函数将会以一个 [CAC](https://github.com/cacjs/cac) 的实例作为第一个参数被调用。

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

现在你可以在你项目中使用 `mdpress info [targetDir]` 了！

::: tip
值得注意的是，一个自定义的 command 需要 MdPress 像 `mdpress dev` 或 `mdpress build` 去定位到你的站点配置，所以在开发一个 command 时，请确保引导用户去传入 `targetDir` 作为 CLI 参数的一部分。
:::

