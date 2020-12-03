# Directory Structure

MdPress follows the principle of **"Convention is better than configuration"**, the recommended document structure is as follows:

<!-- textlint-disable terminology -->

::: file
.
├── docs
│   ├── .mdpress _(**Optional**)_
│   │   ├── `components` _(**Optional**)_
│   │   ├── `theme` _(**Optional**)_
│   │   │   └── Layout.js
│   │   ├── `public` _(**Optional**)_
│   │   ├── `styles` _(**Optional**)_
│   │   │   ├── index.styl
│   │   │   └── palette.styl
│   │   ├── `templates` _(**Optional, Danger Zone**)_
│   │   │   ├── dev.html
│   │   │   └── ssr.html
│   │   ├── `config.js` _(**Optional**)_
│   │   └── `enhanceApp.js` _(**Optional**)_
│   │ 
│   ├── README.md
│   ├── guide
│   │   └── README.md
│   └── config.md
│ 
└── package.json
:::

<!-- textlint-enable -->

::: warning Note
Please note the capitalization of the directory name.
:::

- `docs/.mdpress`: It’s used to store global configuration, components, static resources, etc.
- `docs/.mdpress/components`: The React components in this directory will be automatically registered as global components.
- `docs/.mdpress/theme`: Used to store local theme.
- `docs/.mdpress/styles`: Stores style related files.
- `docs/.mdpress/styles/index.styl`: Automatically applied global style files, generated at the ending of the CSS file, have a higher priority than the default style.
- `docs/.mdpress/styles/palette.styl`: The palette is used to override the default color constants and to set the color constants of Stylus.
- `docs/.mdpress/public`: Static resource directory.
- `docs/.mdpress/templates`: Store HTML template files.
- `docs/.mdpress/templates/dev.html`: HTML template file for development environment.
- `docs/.mdpress/templates/ssr.html`: React SSR based HTML template file in the built time.
- `docs/.mdpress/config.js`: Entry file of configuration, can also be `yml` or `toml`.
- `docs/.mdpress/enhanceApp.js`: App level enhancement.

::: warning Note
When customizing `templates/ssr.html`, or `templates/dev.html`, it’s best to edit it on the basis of the [default template files](https://github.com/docschina/mdpress/tree/master/packages/@mdpress/core/lib/client/index.dev.html), otherwise it may cause a build failure.
:::

## Default Page Routing

Here we take `docs` directory as the `targetDir` (See [Command-line Interface](../api/cli.md#usage)), and all the "Relative Path" below are relative to `docs` directory. Add `scripts` in `package.json` which is located in the project root directory:

```json
{
  "scripts": {
    "dev": "mdpress dev docs",
    "build": "mdpress build docs"
  }
}
```

For the above directory structure, the default page routing paths are as follows:

|    Relative Path   |  Page Routing  |
|--------------------|----------------|
| `/README.md`       | `/`            |
| `/guide/README.md` | `/guide/`      |
| `/config.md`       | `/config.html` |

**Also see:**

- [Config](../config/README.md)
- [Theme](../theme/)
- [Default Theme Config](../theme/default-theme-config.md)

