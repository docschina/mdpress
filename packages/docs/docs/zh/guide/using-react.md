# 在 Markdown 中 使用 React

## 浏览器的 API 访问限制

当你在开发一个 MdPress 应用时，由于所有的页面在生成静态 HTML 时都需要通过 Node.js 服务端渲染，因此所有的 React 相关代码都请确保只在组件挂载后访问浏览器 / DOM 的 API。

如果你正在使用，或者需要展示一个对于 SSR 不怎么友好的组件（比如包含了自定义指令），你可以将它们包裹在内置的 `<ClientOnly>` 组件中：

``` md
import ClientOnly from '@app/components/ClientOnly';

// 其他代码
<ClientOnly>
  <NonSSRFriendlyComponent/>
</ClientOnly>
```

请注意，这并不能解决一些组件或库在**导入**时就试图访问浏览器 API 的问题 —— 如果需要使用这样的组件或库，你需要在合适的生命周期钩子中**动态导入**它们：

``` jsx
import React from 'react';

class Comp extends React.Component {
  componentDidMount(){
    import('./lib-that-access-window-on-import').then(module => {
      // use code
    })
  }
  render() {
    // ...
  }
}
```

## 模板语法

### 访问网站以及页面的数据

编译后的组件没有私有数据，但可以访问 [网站的元数据](../theme/writing-a-theme.md#网站和页面的元数据)，举例来说：

**Input**

````` md
```rc
return JSON.stringify($page,null,2)
```
`````

**Output**

``` json
{
  "path": "/using-react.html",
  "title": "Using React in Markdown",
  "frontmatter": {}
}
```

## 使用组件

所有在 `.mdpress/components` 中找到的 `*.js` 文件将会自动地被注册为全局的异步组件，如：

```
.
└─ .mdpress
   └─ components
      ├─ Demo.js
      ├─ OtherComponent.js
      └─ Foo
         └─ Bar.js
```

你可以直接使用这些组件在任意的 Markdown 文件中（组件名是通过文件名取到的）：

``` md
<Demo/>
<OtherComponent/>
<Foo_Bar/>
```

<Demo/>

<OtherComponent/>

<Foo_Bar/>

::: warning 重要！
请确保一个自定义组件的名字是 PascalCase，否则，它将会被视为一个内联元素，并被包裹在一个 `<p>` 标签中，这将会导致 HTML 渲染紊乱，因为 HTML 标准规定， `<p>` 标签中不允许放置任何块级元素。
:::

### 在标题中使用组件

你可以在标题中使用 React 组件，但是请留意以下两种方式的不同：

| Markdown | 输出的 HTML | 解析后的标题 |
|--------|-------------|----------------|
| <pre v-pre><code> # text &lt;Tag/&gt; </code></pre> | `<h1>text <Tag/></h1>` | `text` |
| <pre v-pre><code> # text \`&lt;Tag/&gt;\` </code></pre> | `<h1>text <code>&lt;Tag/&gt;</code></h1>` | `text <Tag/>` |

被 `<code>` 包装的 HTML 将按原样显示，只有未被包装的 HTML 才会被 React 解析。

::: tip
输出的 HTML 由 [markdown-it](https://github.com/markdown-it/markdown-it) 完成。而解析后的标题由 MdPress 完成，用于[侧边栏](../theme/default-theme-config.md#侧边栏)以及文档的标题。
:::

## 使用预处理器

MdPress 对以下预处理器已经内置相关的 webpack 配置：`sass`、`scss`、`less`、`stylus` 和 `pug`。要使用它们你只需要在项目中安装对应的依赖即可。例如，要使用 `sass`，需要安装：

``` bash
yarn add -D sass-loader node-sass
```
 
然后你就可以在 Markdown 或是组件中使用相应的样式文件。

要在组件中使用 pug，则需要安装 `pug` 和 `pug-plain-loader`:

``` bash
yarn add -D pug pug-plain-loader
```

::: tip
需要指出的是，如果你是一个 `stylus` 用户，你并不需要在你的项目中安装 `stylus` 和 `stylus-loader`，因为 MdPress 已经内置了它们。
  
对于那些没有内置的预处理器，除了安装对应的依赖，你还需要 [拓展内部的 Webpack 配置](../config/README.md#configurewebpack)。
:::

<!--
## 脚本和样式提升

有时，你可以只想在当前页面应用一些 JavaScript 或者 CSS，在这种情况下，你可以直接在 Markdown 文件中使用原生的 `<script>` 或者 `<style>` 标签，它们将会从编译后的 HTML 文件中提取出来，并作为生成的 `<script>` 和 `<style>` 标签。

<p class="demo" :class="$style.example"></p>

<style module>
.example {
  color: #41b883;
}
</style>

<script>
export default {
  props: ['slot-key'],
  mounted () {
    document.querySelector(`.${this.$style.example}`)
      .textContent = '这个块是被内联的脚本渲染的，样式也采用了内联样式。'
  }
}
</script>
-->

## 内置的组件

### OutboundLink <Badge text="stable"/>

(<OutboundLink/>) 用来表明当前是一个外部链接。在 MdPress 中这个组件会紧跟在每一个外部链接后面。

### ClientOnly <Badge text="stable"/>

参考 [浏览器的 API 访问限制](#浏览器的-api-访问限制)。

### Content <Badge text="beta" type="warn"/>

- **Props**:

  - `pageKey` - string, 要渲染的 [page](./global-computed.md#page) 的 hash key, 默认值是当前页面的 key.
  - `slotKey` - string, 页面的 [markdown slot](./markdown-slot.md) 的 key. 默认值是 [default slot](./markdown-slot.md#default-slot-content).

- **Usage**：

指定一个指定页面的特定 slot 用于渲染，当你使用 [自定义布局](../theme/default-theme-config.md#特定页面的自定义布局) 或者自定义主题时，这将非常有用。


``` jsx
<Content/>
```

**参考:**

- [全局计算属性 > $page](./global-computed.md#page)
- [Markdown 插槽](./markdown-slot.md)
- [开发主题 > 获取渲染内容](../theme/writing-a-theme.md#获取渲染内容)


### Badge <Badge text="beta" type="warning"/> <Badge text="默认主题"/>

- **Props**:

  - `text` - string
  - `type` - string, 可选值： `"tip"|"warning"|"error"`，默认值是： `"tip"`
  - `vertical` - string, 可选值： `"top"|"middle"`，默认值是： `"top"`

- **Usage**:

你可以在标题中，使用这个组件来为某些 API 添加一些状态：

``` md
### Badge <Badge text="beta" type="warning"/> <Badge text="默认主题"/>
```

**参考:**

- [在标题中使用组件](#在标题中使用组件)
