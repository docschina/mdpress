---
title: medium-zoom
metaTitle: Medium-Zoom 插件 | MdPress
---

# [@mdpress/plugin-medium-zoom](https://github.com/docschina/mdpress/tree/master/packages/@mdpress/plugin-medium-zoom)

> [medium-zoom](https://github.com/francoischalifour/medium-zoom) 插件

## 安装

```bash
yarn add -D @mdpress/plugin-medium-zoom
# OR npm install -D @mdpress/plugin-medium-zoom
```

## 使用

**简单使用**:

```javascript
module.exports = {
  plugins: ['@mdpress/medium-zoom']
}
```

**自定义选项**:

```javascript
module.exports = {
  plugins: {
    '@mdpress/medium-zoom': {
      selector: 'img.zoom-custom-imgs',
      // medium-zoom options here
      // See: https://github.com/francoischalifour/medium-zoom#options
      options: {
        margin: 16
      }
    }
  }
}
```

## 选项

### selector

- 类型: `string`
- 默认值: `.theme-default-content :not(a) > img`

值得注意的是， `.theme-default-content` 是默认主题添加给 [`<Content />`](../../guide/using-react.md#content) 组件的 class name。

### options

- 类型: `object`
- 默认值: `undefined`

[medium-zoom](https://github.com/francoischalifour/medium-zoom) 的 [选项](https://github.com/francoischalifour/medium-zoom#options)。
