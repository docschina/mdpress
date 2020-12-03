---
home: true
heroImage: /hero.png
actionText: 快速上手 →
actionLink: /zh/guide/
features:
- title: 简洁至上
  details: 以 Markdown 为中心的项目结构，以最少的配置帮助你专注于写作。
- title: Markdown 驱动
  details: 享受 Webpack 的开发体验，可以在 Markdown 中使用 React 组件，并支持使用 React 来开发自定义主题。
- title: 高性能
  details: MdPress 会为每个页面预渲染生成静态的 HTML，同时，每个页面被加载的时候，将作为 SPA 运行。
footer: MIT Licensed | Copyright © 2020-present docschina
---

### 像数 1, 2, 3 一样容易

``` bash
# 安装
yarn global add mdpress # 或者：npm install -g mdpress

# 新建一个 markdown 文件
echo '# Hello MdPress!' > README.md

# 开始写作
mdpress dev .

# 构建静态文件
mdpress build .
```

::: warning 注意
请确保你的 Node.js 版本 >= 8。
:::

