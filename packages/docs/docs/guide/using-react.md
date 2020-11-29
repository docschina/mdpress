# Using React in Markdown

## Browser API Access Restrictions

Because MdPress applications are server-rendered in Node.js when generating static builds, any React usage must conform to make sure to only access Browser / DOM APIs in `beforeMount` or `mounted` hooks.

If you are using or demoing components that are not SSR friendly (for example containing custom directives), you can wrap them inside the built-in `<ClientOnly>` component:

``` md
import ClientOnly from '@app/components/ClientOnly';

// other code
<ClientOnly>
  <NonSSRFriendlyComponent/>
</ClientOnly>
```

Note this does not fix components or libraries that access Browser APIs **on import** - to use code that assumes a browser environment on import, you need to dynamically import them in proper lifecycle hooks:

``` jsx
import React from 'react';

class Comp extends React.Component {
  componentDidMount(){
    import('./lib-that-access-window-on-import').then(module => {
      // use code
    })
  }
}
```

## Templating

### Access to Site & Page Data

The compiled component does not have any private data but does have access to the [site metadata](../theme/writing-a-theme.md#site-and-page-metadata). For example:

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

## Using Components

Any `*.js` files found in `.mdpress/components` are automatically registered as global, async components. For example:

```
.
└─ .mdpress
   └─ components
      ├─ Demo.js
      ├─ OtherComponent.js
      └─ Foo
         └─ Bar.js
```

Inside any Markdown file you can then directly use the components (names are inferred from filenames):

``` md
<Demo/>
<OtherComponent/>
<Foo_Bar/>
```

<Demo/>

<OtherComponent/>

<Foo_Bar/>

::: warning IMPORTANT
Make sure a custom component’s name is in PascalCase. Otherwise it will be treated as an inline element and wrapped inside a `<p>` tag, which will lead to hydration mismatch because `<p>` does not allow block elements to be placed inside it.
:::

### Using Components In Headers

You can use React components in the headers, but note the difference between the following two ways:

| Markdown | Output HTML | Parsed Header |
|--------|-------------|----------------|
| <pre v-pre><code> # text &lt;Tag/&gt; </code></pre> | `<h1>text <Tag/></h1>` | `text` |
| <pre v-pre><code> # text \`&lt;Tag/&gt;\` </code></pre> | `<h1>text <code>&lt;Tag/&gt;</code></h1>` | `text <Tag/>` |

The HTML wrapped by `<code>` will be displayed as is, only the HTML that is not wrapped will be parsed by React.

::: tip

The output HTML is accomplished by [markdown-it](https://github.com/markdown-it/markdown-it), while the parsed headers are done by MdPress, and used for the [sidebar](../theme/default-theme-config.md#sidebar) and the document title.
:::

## Using Pre-processors

MdPress has built-in webpack config for the following pre-processors: `sass`, `scss`, `less`, `stylus` and `pug`. All you need to do is installing the corresponding dependencies. For example, to enable `sass`, install the following in your project:

``` bash
yarn add -D sass-loader node-sass
```

Now you can use style code in Markdown and theme components.

Using pug requires installing `pug` and `pug-plain-loader`:

``` bash
yarn add -D pug pug-plain-loader
```

::: tip
If you are a Stylus user, you don’t need to install `stylus` and `stylus-loader` in your project because MdPress uses Stylus internally.

For pre-processors that do not have built-in webpack config support, you will need to [extend the internal webpack config](../config/README.md#configurewebpack) and install the necessary dependencies.
:::

<!--
## Script & Style Hoisting

Sometimes you may need to apply some JavaScript or CSS only to the current page. In those cases, you can directly write root-level `<script>` or `<style>` blocks in the Markdown file, and they will be hoisted out of the compiled HTML and used as the `<script>` and `<style>` blocks for the resulting Vue single-file component.

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
      .textContent = 'This is rendered by inline script and styled by inline CSS'
  }
}
</script>
-->

## Built-In Components

### OutboundLink <Badge text="stable"/>

It(`<OutboundLink/>`) is used to specify that this is an external link. In MdPress, this component has been followed by every external link.

### ClientOnly <Badge text="stable"/>

See [Browser API Access Restrictions](#browser-api-access-restrictions).

### Content

- **Props**:

  - `pageKey` - string, [page](./global-computed.md#page)'s hash key, defaults to current page’s key.
  - `slotKey` - string, key of [Markdown slot](./markdown-slot.md). Defaults to [default slot](./markdown-slot.md#default-slot-content).

- **Usage**：

Specify a specific slot for a specific page (.md) for rendering. This will be useful when you use [Custom Layout](../theme/default-theme-config.md#custom-layout-for-specific-pages) or [Writing a theme](../theme/writing-a-theme.md)

``` jsx
<Content/>
```

**Also see:**

- [Global Computed > $page](./global-computed.md#page)
- [Markdown Slot](./markdown-slot.md)
- [Writing a theme > Content Outlet](../theme/writing-a-theme.md#content-outlet)


### Badge <Badge text="beta" type="warning"/> <Badge text="default theme"/>

- **Props**:

  - `text` - string
  - `type` - string, optional value: `"tip"|"warning"|"error"`, defaults to `"tip"`.
  - `vertical` - string, optional value: `"top"|"middle"`, defaults to `"top"`.

- **Usage**:

You can use this component in header to add some status for some API:

``` md
### Badge <Badge text="beta" type="warning"/> <Badge text="default theme"/>
```

**Also see:**

- [Using Components In Headers](#using-components-in-headers)
