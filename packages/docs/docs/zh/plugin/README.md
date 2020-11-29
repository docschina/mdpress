# 插件

插件通常会为 MdPress 添加全局功能。插件的范围没有限制。

## 样例

以下是几种比较常见的插件：

1. 拓展在编译期生成的页面元数据，如：[@mdpress/plugin-last-updated](./official/plugin-last-updated.md)；
2. 在编译前后生成额外的文件，如：[@mdpress/plugin-pwa](./official/plugin-pwa.md)；
3. 注入全局的 UI, 如：[@mdpress/plugin-back-to-top](./official/plugin-back-to-top.md);


## 开箱即用

为了让项目尽可能地简洁，并非所有官方插件都会随着 MdPress 一同安装。以下是一些随着 MdPress 和默认主题一同安装的插件，**没有出现在下表中的插件需要手动安装**（比如：[@mdpress/plugin-back-to-top](./official/plugin-back-to-top.md)）。

### MdPress 自带的插件

- [@mdpress/plugin-last-updated](./official/plugin-last-updated.md)

### 默认主题自带的插件

- [@mdpress/plugin-active-header-links](./official/plugin-active-header-links.md)
- [@mdpress/plugin-nprogress](./official/plugin-nprogress.md)
- [@mdpress/plugin-search](./official/plugin-search.md)
- [@mdpress/plugin-container](./official/plugin-container.md)

## 架构

整个插件系统的架构如下:

![Architecture of MdPress](/architecture.png)
