# 目录结构

MdPress 遵循 **“约定优于配置”** 的原则，推荐的目录结构如下：

::: file
.
├── docs
│   ├── .mdpress _(**可选的**)_
│   │   ├── `components` _(**可选的**)_
│   │   ├── `theme` _(**可选的**)_
│   │   │   └── Layout.js
│   │   ├── `public` _(**可选的**)_
│   │   ├── `styles` _(**可选的**)_
│   │   │   ├── index.styl
│   │   │   └── palette.styl
│   │   ├── `templates` _(**可选的, 谨慎配置**)_
│   │   │   ├── dev.html
│   │   │   └── ssr.html
│   │   ├── `config.js` _(**可选的**)_
│   │   └── `enhanceApp.js` _(**可选的**)_
│   │ 
│   ├── README.md
│   ├── guide
│   │   └── README.md
│   └── config.md
│ 
└── package.json
:::

::: warning 注意
请留意目录名的大写。
:::

- `docs/.mdpres`: 用于存放全局的配置、组件、静态资源等。
- `docs/.mdpres/components`: 该目录中的 React 组件将会被自动注册为全局组件。
- `docs/.mdpres/theme`: 用于存放本地主题。
- `docs/.mdpres/styles`: 用于存放样式相关的文件。
- `docs/.mdpres/styles/index.styl`: 将会被自动应用的全局样式文件，会生成在最终的 CSS 文件结尾，具有比默认样式更高的优先级。
- `docs/.mdpres/styles/palette.styl`: 用于重写默认颜色常量，或者设置新的 stylus 颜色常量。
- `docs/.mdpres/public`: 静态资源目录。
- `docs/.mdpres/templates`: 存储 HTML 模板文件。
- `docs/.mdpres/templates/dev.html`: 用于开发环境的 HTML 模板文件。
- `docs/.mdpres/templates/ssr.html`: 构建时基于 React SSR 的 HTML 模板文件。
- `docs/.mdpres/config.js`: 配置文件的入口文件，也可以是 `YML` 或 `toml`。
- `docs/.mdpres/enhanceApp.js`: 客户端应用的增强。

::: warning 注意
当你想要去自定义 `templates/ssr.html` 或 `templates/dev.html` 时，最好基于 [默认的模板文件](https://github.com/docschina/mdpress/blob/master/packages/%40mdpress/core/lib/client/index.dev.html) 来修改，否则可能会导致构建出错。
:::

**同时阅读:**

- [配置](../config/README.md)
- [主题](../theme/README.md)
- [默认主题配置](../theme/default-theme-config.md)

## 默认的页面路由

此处我们把 `docs` 目录作为 `targetDir` （参考 [命令行接口](../api/cli.md#基本用法)），下面所有的“文件的相对路径”都是相对于 `docs` 目录的。在项目根目录下的 `package.json` 中添加 `scripts` ：

```json
{
  "scripts": {
    "dev": "mdpres dev docs",
    "build": "mdpres build docs"
  }
}
```

对于上述的目录结构，默认页面路由地址如下：

|   文件的相对路径    |  页面路由地址   |
|--------------------|----------------|
| `/README.md`       | `/`            |
| `/guide/README.md` | `/guide/`      |
| `/config.md`       | `/config.html` |

