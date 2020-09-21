---
title: active-header-links
metaTitle: A plugin of automatically activating sidebar links when page scrolls | MdPress
---

# [@mdpress/plugin-active-header-links](https://github.com/LinFeng1997/mdpress/tree/master/packages/%40vuepress/plugin-active-header-links)

> A plugin of automatically activating sidebar links when page scrolls

## Install

```bash
yarn add -D @mdpress/plugin-active-header-links
# OR npm install -D @mdpress/plugin-active-header-links
```

## Usage

```javascript
module.exports = {
  plugins: ['@mdpress/active-header-links']
}
```

### Passing Options

```javascript
module.exports = {
  plugins: ['@mdpress/active-header-links', {
    sidebarLinkSelector: '.sidebar-link',
    headerAnchorSelector: '.header-anchor'
  }]
}
```

## Options

### sidebarLinkSelector

- Type: `string`
- Default: `.sidebar-link`

### headerAnchorSelector

- Type: `string`
- Default: `.header-anchor`
