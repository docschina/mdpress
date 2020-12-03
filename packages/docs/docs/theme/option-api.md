---
metaTitle: Configuration | Theme
---

# Theme Configuration

As with plugins, the theme configuration file `themeEntry` should export a `plain JavaScript object`(`#1`). If the plugin needs to take options, it can be a function that exports a plain object(`#2`). The function will be called with the `siteConfig.themeConfig` as the first argument, along with [ctx](../plugin/context-api.md) which provides some compile-time metadata.

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
1. You should see the difference between `themeEntry` and `themeConfig`, the former is a configuration for the theme itself, provided by MdPress. The latter is the user’s configuration for the theme, implemented by the used theme, for example [Default Theme Config](./default-theme-config.md).

2. Along with the options listed in this section, `themeEntry` also supports all [Option API](../plugin/option-api.md) and [Lifecycle](../plugin/life-cycle.md) supported by plugins.
:::

## plugins

- Type: `Array|Object`
- Default: undefined

**Also see:**

- [Plugin > Using a Plugin](../plugin/using-a-plugin.md).

---

::: warning
You probably don’t need to use following options tagged with <Badge text="Danger Zone" vertical="middle"/> unless you know what you are doing!
:::

## devTemplate <Badge text="Danger Zone"/>

- Type: `String`
- Default: undefined

HTML template path used in `dev` mode, default template see [here](https://github.com/docschina/mdpress/tree/master/packages/@mdpress/core/lib/client/index.dev.html)

## ssrTemplate <Badge text="Danger Zone"/>

- Type: `String`
- Default: undefined

HTML template path used in `build` mode, default template see [here](https://github.com/docschina/mdpress/tree/master/packages/@mdpress/core/lib/client/index.ssr.html)

## extend <Badge text="Danger Zone"/>

- Type: `String`
- Default: undefined

```js
module.exports = {
  extend: '@mdpress/theme-default'
}
```

MdPress provides the ability to inherit one theme from another. MdPress will follow the concept of `override` and automatically help you prioritize thematic attributes, for example styles and layout components.

**Also see:**

- [Theme Inheritance](./inheritance.md)
- [Design Concepts of MdPress 1.x](../miscellaneous/design-concepts.md)

## globalLayout <Badge text="Danger Zone"/>

- Type: `String`
- Default: undefined

```js
// themePath/index.js
module.exports = {
  globalLayout: '/path/to/your/global/layout'
}
```

Global layout component is a component responsible for the global layout strategy. The [default global layout](https://github.com/docschina/mdpress/tree/master/packages/@mdpress/core/lib/client/components/GlobalLayout.js) will help you render different layouts according to [$frontmatter.layout](../guide/frontmatter.md#layout), so in most cases you do not need to configure this option.

For example, when you want to set a global header and footer for your theme, you can do this:

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
