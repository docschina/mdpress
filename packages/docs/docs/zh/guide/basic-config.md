# 基本配置

## 配置文件

如果没有任何配置，这个网站将会是非常局限的，用户也无法在你的网站上自由导航。为了更好地自定义你的网站，让我们首先在你的文档目录下创建一个 `.mdpres` 目录，所有 MdPress 相关的文件都将会被放在这里。你的项目结构可能是这样：

```
.
├─ docs
│  ├─ README.md
│  └─ .mdpress
│     └─ config.js
└─ package.json
```

一个 MdPress 网站必要的配置文件是 `.mdpress/config.js`，它应该导出一个 JavaScript 对象：

``` js
module.exports = {
  title: 'Hello MdPress',
  description: 'Just playing around'
}
```

对于上述的配置，如果你运行起 dev server，你应该能看到一个页面，它包含一个页头，里面包含一个标题和一个搜索框。MdPress 内置了基于 headers 的搜索 —— 它会自动为所有页面的标题、`h2` 和 `h3` 构建起一个简单的搜索索引。

参见 [配置](../config/README.md) 来查看所有可配置的选项。

::: tip 其他配置格式
你也可以使用 YAML (`.mdpress/config.yml`) 或是 TOML (`.mdpress/config.toml`) 格式的配置文件。
:::

## 主题配置

一个 MdPress 主题应该负责整个网站的布局和交互细节。在 MdPress 中，目前自带了一个默认的主题（正是你现在所看到的），它是为技术文档而设计的。同时，默认主题提供了一些选项，让你可以去自定义导航栏（navbar）、 侧边栏（sidebar）和 首页（homepage） 等，详情请参见 [默认主题](../theme/default-theme-config.md) 。

如果你想开发一个自定义主题，可以参考 [自定义主题](../theme/README.md)。

## 应用级别的配置

由于 MdPress 是一个标准的 React 应用，你可以通过创建一个 `.mdpress/enhanceApp.js` 文件来做一些应用级别的配置，当该文件存在的时候，会被导入到应用内部。`enhanceApp.js` 应该 `export default` 一个钩子函数，并接受一个包含了一些应用级别属性的对象作为参数。你可以使用这个钩子来安装一些附加的 React 组件、注册全局组件，或者修改路由等：

``` js
// 使用异步函数也是可以的
export default ({
  sandbox, // MdPress 用于给 Markdown 文件中使用 React 组件的沙箱
  routes, // 当前应用的路由配置
  siteData, // 站点元数据
  isServer, // 当前应用配置是处于 服务端渲染 或 客户端
  mdConfig, // 当前应用的 Markdown 额外配置
  hooks, // 附加到根实例的一些钩子
}) => {
  // ...做一些其他的应用级别的优化
}
```

**相关阅读：**

- [插件 API 中的 enhanceApp](../plugin/option-api.md#enhanceappfiles)
