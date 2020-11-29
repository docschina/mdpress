---
title: nprogress
metaTitle: Nprogress Plugin | MdPress
---

# [@mdpress/plugin-nprogress](https://github.com/docschina/mdpress/tree/master/packages/%40vuepress/plugin-nprogress)

> A progress bar plugin based on [nprogress](https://github.com/rstacruz/nprogress).

## Install

```bash
yarn add -D @mdpress/plugin-nprogress
# OR npm install -D @mdpress/plugin-nprogress
```

## Usage

```javascript
module.exports = {
  plugins: ['@mdpress/nprogress']
}
```

## Custom color

Set `$nprogressColor` in your __site__ or __theme__ `palette.styl` file to change the color of the progress bar (default is `$accentColor`).

```stylus
// .mdpress/styles/palette.styl
// or
// .mdpress/theme/styles/palette.styl

$nprogressColor = red
```

__Also see:__

- [Config Reference > Styling](../../config/README.md#styling)
