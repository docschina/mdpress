---
title: nprogress
metaTitle: Nprogress 插件 | MdPress
---

# [@mdpress/plugin-nprogress](https://github.com/LinFeng1997/mdpress/tree/master/packages/%40mdpress/plugin-nprogress)

> 一个基于 [nprogress](https://github.com/rstacruz/nprogress) 的进度条插件。

## 安装

```bash
yarn add -D @mdpress/plugin-nprogress
# 或者 npm install -D @mdpress/plugin-nprogress
```

## 使用

```javascript
module.exports = {
  plugins: ['@mdpress/nprogress']
}
```

## 自定义颜色

在你的 __site__ 或 __theme__ 的 `palette.styl` 文件中设置 `$nprogressColor` 来改变进度条的颜色（默认使用 `$accentColor`）。

```stylus
// .mdpress/styles/palette.styl
// 或者
// .mdpress/theme/styles/palette.styl

$nprogressColor = red
```

__参考：__

- [配置 > Styling](../../config/README.md#styling)
