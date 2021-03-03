# 静态资源

## 公共文件

所有的静态资源，你都需要将它们放在 `.mdpress/public` 中，无论是直接被你的任何一个 markdown 文件或者主题组件引用的图片，还是 favicons 和 PWA 的图标。它们最终会被复制到生成的静态文件夹中。

## 基础路径

如果你的网站会被部署到一个**非根路径**，你将需要在 `.mdpress/config.js` 中设置 `base`，举例来说，如果你打算将你的网站部署到 `https://foo.github.io/bar/`，那么 `base` 的值就应该被设置为 `"/bar/"` (应当总是以斜杠开始，并以斜杠结束)。

有了基础路径（Base URL），如果你希望引用一张放在 `.mdpress/public` 中的图片，你需要使用这样路径：`/bar/image.png`，然而，一旦某一天你决定去修改 `base`，这样的路径引用将会显得异常脆弱。为了解决这个问题，MdPress 提供了内置的一个 helper `$withBase`（它可以通过 useData 这个钩子获取），可以帮助你生成正确的路径：

``` jsx
import useData from '@app/hooks/data';

function Foo(){
    const { $withBase } = useData();
    return <img src={$withBase('/foo.png')} alt="foo"/>;
}
```

值得一提的是，你不仅可以在你的 React 组件中使用上述的语法，在 Markdown 文件中亦是如此。

````
```rc
const src = $withBase('/foo.png');
return <div><img src={src} alt="foo"/></div>
```
````

最后补充一句，一个 `base` 路径一旦被设置，它将会自动地作为前缀插入到 `.mdpress/config.js` 中所有以 `/` 开始的资源路径中。