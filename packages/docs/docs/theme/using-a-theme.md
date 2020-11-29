# Using a theme

Using a theme is almost the same as using a plugin.

## Using a theme from a dependency

Themes can be published on npm in raw Component SFC format as `mdpress-theme-xxx`.

``` js
module.exports = {
  theme: 'mdpress-theme-xx'
}
```

## Theme Shorthand

If you prefix the theme with `mdpress-theme-`, you can use a shorthand to leave out that prefix:

``` js
module.exports = {
  theme: 'xxx'
}
```

Same with:

``` js
module.exports = {
  theme: 'mdpress-theme-xxx'
}
```

This also works with [Scoped Packages](https://docs.npmjs.com/misc/scope):

``` js
module.exports = {
  theme: '@org/mdpress-theme-xxx', // or an official theme: '@mdpress/theme-xxx'
}
```

Shorthand:

``` js
module.exports = {
  theme: '@org/xxx', // or an official theme: '@mdpress/xxx'
}
```

::: warning Note
The theme whose name starts with `@mdpress/theme-` is an officially maintained theme.
:::
