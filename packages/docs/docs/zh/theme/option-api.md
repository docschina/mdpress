---
metaTitle: Configuration | Theme
---

# 主题的配置

和插件几乎一样，主题的配置文件 `themeEntry` 应该导出一个普通的 JavaScript 对象（`#1`），它也可以是一个返回对象的函数（`#2`），这个函数接受用户在 `siteConfig.themeConfig` 为第一个参数、包含编译期上下文的 [ctx](../plugin/context-api.md) 对象作为第二个参数。

``` js
// #1
module.exports = {
   // ...
}
```

``` js
// #2
module.exports = (themeConfig, ctx) => {
   return {
      // ...
   }
}
```

::: tip
1. 你应该能看到 `themeEntry` 和 `themeConfig` 的区别，前者是一个主题本身的配置，这些配置由 MdPress 本身提供；而后者则是用户对主题的配置，这些配置选项则由当前使用的主题来实现，如 [默认主题配置](./default-theme-config.md)。
2. 除了本节列出的选项，`themeEntry` 也支持插件支持的所有 [配置选项](../plugin/option-api.md) 和 [生命周期](../plugin/life-cycle.md)。
:::

## plugins

- 类型: `Array|Object`
- 默认值: undefined

**参考:**

- [插件 > 使用插件](../plugin/using-a-plugin.md).

---

::: warning 注意
你可能不需要使用下面这些带有 <Badge text="Danger Zone" vertical="middle"/> 的选项，除非你知道你在做什么！
:::

## devTemplate <Badge text="Danger Zone"/>

- 类型: `String`
- 默认值: undefined

dev 模式下使用的 HTML 模板路径，默认模板见 [这里](https://github.com/LinFeng1997/mdpress/tree/master/packages/@mdpress/core/lib/client/index.dev.html)。

## ssrTemplate <Badge text="Danger Zone"/>

- 类型: `String`
- 默认值: undefined

build 模式下使用的 HTML 模板路径，默认模板见 [这里](https://github.com/LinFeng1997/mdpress/tree/master/packages/@mdpress/core/lib/client/index.ssr.html)。

## extend <Badge text="Danger Zone"/>

- 类型: `String`
- 默认值: undefined

```js
module.exports = {
  extend: '@mdpress/theme-default'
}
```

MdPress 支持一个主题继承于另一个主题。MdPress 将遵循 `override` 的理念自动帮你解决各种主题属性（如样式、布局组件）的优先级。

**参考:**

- [主题继承](./inheritance.md)

## globalLayout <Badge text="Danger Zone"/>

- 类型: `String`
- 默认值: undefined

```js
// themePath/index.js
module.exports = {
  globalLayout: '/path/to/your/global/layout'
}
```

全局布局组件是负责管理全局布局方案的一个组件，MdPress [默认的 globalLayout](https://github.com/LinFeng1997/mdpress/tree/master/packages/@mdpress/core/lib/client/components/GlobalLayout.js)会帮你根据 [$frontmatter.layout](../guide/frontmatter.md#layout) 来渲染不同的布局，所以大部分情况下你不要配置此选项。

举例来说，当你想为当前主题设置全局的 header 和 footer 时，你可以这样做：


```jsx
<!-- themePath/layouts/GlobalLayout.js -->
import React from 'react';
import store from '@app/store';
import useData from '@app/hooks/data';
import useUpdateMeta from '@app/hooks/updateMeta';
import { getLayoutAsyncComponent } from '@app/util';

export default function GlobalLayout(props) {
  const { $page } = useData();
  useUpdateMeta(props);

  const getLayout = ()  => {
    if ($page && $page.path) {
      const layout = $page.frontmatter.layout;
      if (layout && (store.getLayoutAsyncComponent(layout)
          || store.getSyncComponent(layout))) {
        return layout;
      }
      return 'Layout';
    }
    return 'NotFound';
  };

  const layout = getLayout();
  const Comp = getLayoutAsyncComponent(layout) || (() => <div>Error!</div>);
  return <div>
    <header><h1>Header</h1></header>
    <Comp/>
    <footer><h1>Footer</h1></footer>
  </div>;
}
```
