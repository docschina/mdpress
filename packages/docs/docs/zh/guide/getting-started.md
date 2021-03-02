# 快速上手

::: warning 注意
请确保你的 Node.js 版本 >= 8。
:::

## 全局安装

如果你只是想尝试一下 MdPress，你可以全局安装它：

``` bash
# 安装
yarn global add mdpress # 或者：npm install -g mdpress

# 创建项目目录
mkdir mdpress-starter && cd mdpress-starter

# 新建一个 markdown 文件
echo '# Hello MdPress!' > README.md

# 开始写作
mdpress dev .

# 构建静态文件
mdpress build .
```

## 现有项目

如果你想在一个现有项目中使用 MdPress，同时想要在该项目中管理文档，则应该将 MdPress 安装为本地依赖。作为本地依赖安装让你可以使用持续集成工具，或者一些其他服务（比如 Netlify）来帮助你在每次提交代码时自动部署。

``` bash
# 将 MdPress 作为一个本地依赖安装
yarn add -D mdpress # 或者：npm install -D mdpress

# 新建一个 docs 文件夹
mkdir docs

# 新建一个 markdown 文件
echo '# Hello MdPress!' > docs/README.md

# 开始写作
npx mdpress dev docs
```

::: warning
如果你的现有项目依赖了 webpack 3.x，推荐使用 [Yarn](https://yarnpkg.com/en/) 而不是 npm 来安装 MdPress。因为在这种情形下，npm 会生成错误的依赖树。
:::

接着，在 `package.json` 里加一些脚本:

``` json
{
  "scripts": {
    "docs:dev": "mdpress dev docs",
    "docs:build": "mdpress build docs"
  }
}
```

然后就可以开始写作了:

``` bash
yarn docs:dev # 或者：npm run docs:dev
```

要生成静态的 HTML 文件，运行：

``` bash
yarn docs:build # 或者：npm run docs:build
```

默认情况下，文件将会被生成在 `.mdpress/dist`，当然，你也可以通过 `.mdpress/config.js` 中的 `dest` 字段来修改，生成的文件可以部署到任意的静态文件服务器上，参考 [部署](./deploy.md) 来了解更多。

## 动态数据源
参考：渲染来自腾讯云 CMS 上的数据。