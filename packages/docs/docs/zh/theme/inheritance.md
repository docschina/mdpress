# 主题的继承 <Badge type="warning" text="beta" />

## 概念

为了介绍本节，我们先几个基本概念：

- **原子主题**：即父主题，类似默认主题这种完全从头实现的主题。
- **派生主题**：即子主题，基于父主题创建的主题；

::: tip 提示
主题继承暂时不支持高阶继承，也就是说，一个派生主题无法被继承。
:::

## 使用

假设你想创建一个继承自 MdPress 默认主题的派生主题，你只需要在你的主题配置中配置 [extend](./option-api.md#extend) 选项：

```js
// themePath/index.js
module.exports = {
  extend: '@mdpress/theme-default'
}
```

## 继承策略

父主题的所有能力都会"传递"给子主题，对于文件级别的约定，子主题可以通过在同样的位置创建同名文件来覆盖它；对于某些主题配置选项，如 [globalLayout](./option-api.md#globallayout)，子主题也可以通过同名配置来覆盖它。

[文件级别的约定](./writing-a-theme.md#目录结构)如下：

- **沙箱组件**，即放置在 `theme/sandbox` 中的 React 组件。
- **组件**，即放置在 `theme/components` 中的 React 组件。
- **全局的样式和调色板**，即放置在 `theme/styles` 中的 `index.styl` 和 `palette.styl`。
- **HTML 模板**，即放置在 `theme/templates` 中的 `dev.html` 和 `ssr.html`。
- **主题水平的客户端增强文件**，即 `theme/enhanceApp.js`

对于主题配置，能被子主题覆盖的配置选项如下：

- [devTemplate](./option-api.md#devtemplate)
- [ssrTemplate](./option-api.md#ssrtemplate)
- [globalLayout](./option-api.md#globallayout)

无法被子主题覆盖的主题配置选项如下：

- [extend](./option-api.md#extend)

需要特殊处理的主题选项：

- [plugins](./option-api.md#plugins)：参见 [插件的覆盖](#插件的覆盖)。

## 插件的覆盖

对于父主题中的 [plugins](./option-api.md#plugins), 子主题不会直接覆盖它，但是插件的选项可以通过创建同名的插件配置来覆盖。

举例来说，如果父主题具有如下配置：

```js
// parentThemePath/index.js
module.exports = {
  plugins: [
    ['@mdpress/search', {
      searchMaxSuggestions: 5
    }]
  ]
}
```

那么子主题可以通过如下方式来修改该插件的默认值：

```js
// themePath/index.js
module.exports = {
  plugins: [
    ['@mdpress/search', {
      searchMaxSuggestions: 10
    }]
  ]
}
```

也可以选择禁用它：

```js
// themePath/index.js
module.exports = {
  plugins: [
    ['@mdpress/search', false]
  ]
}
```

::: warning
一般情况下，你都不需要这样做，除非你明确知道禁用父主题中的插件不会带来问题。
:::

## 组件的覆盖

你可能想要在子主题中覆盖父主题中的同名组件，默认情况下，当父主题中的组件都使用相对路径引用其他组件时，你将不可能做到这一点，因为你无法在运行时修改父主题的代码。

MdPress 则通过一种巧妙的方式实现了这种需求，但这对父主题有一定的要求——**所有的组件都必须使用 `@theme` 别名来引用其他组件**。

举例来说，如果你正在开发的一个原子主题的结构如下：

::: file
theme
├── components
│   ├── `Home.js`
│   ├── `Navbar.js`
│   └── `Sidebar.js`
├── layouts
│   ├── `404.js`
│   └── `Layout.js`
├── package.json
└── index.js
:::

那么，在该主题中的任意 React 组件中，**你都应该通过 `@theme` 来访问主题根目录**：

```jsx
import Navbar from '@theme/components/Navbar.js'
// ...
```

在这样的前提下，当你在子主题中同样的位置创建一个 `Navbar` 组件时：

::: file
theme
└── components
    └── `Navbar.js`
:::

`@theme/components/Navbar.js` 会自动地映射到子主题中的 Navbar 组件，当你移除这个组件时，`@theme/components/Navbar.js` 又会自动恢复为父主题中的 Navbar 组件。

如此一来，就可以实现轻松地“篡改”一个原子主题的某个部分。

::: tip
1. 组件的覆盖，最好直接基于父主题中对应组件的代码来修改；
2. 目前，在本地开发子主题，每次创建或移除组件时，你需要手动重启 Dev Server。
:::

## 访问父主题

你可以使用 `@parent-theme` 来访问父主题的根路径，下述示例展示了在子主题中创建一个同名的布局组件。

```jsx
// themePath/components/Foo.js
import ParentLayout from '@parent-theme/layouts/Layout.js'
import Foo from '@theme/components/Foo.js'

export default function Layout(){
  return <ParentLayout>
             <Foo/>
         </ParentLayout>
}
```





