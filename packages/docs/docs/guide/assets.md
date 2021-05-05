# Asset Handling

## Public Files

For all static resources,you need to put them in '.mdpress/public'.Whether it's a image directly referenced by any of your Markdown files or theme components,or favicons and PWA icons.They are eventually copied to the resulting static folder.

## Base URL

If your site is deployed to a non-root URL, you will need to set the `base` option in `.mdpress/config.js`. For example, if you plan to deploy your site to `https://foo.github.io/bar/`, then `base` should be set to `"/bar/"` (it should always start and end with a slash).

With a base URL, to reference an image in `.mdpress/public`, you’d have to use URLs like `/bar/image.png`. Yet, this is brittle if you ever decide to change the `base` later. To help with that, MdPress provides a built-in helper `$withBase` (from useData hook) that generates the correct path:

``` jsx
import useData from '@app/hooks/data';

<img :src="$withBase('/foo.png')" alt="foo">
function Foo(){
    const { $withBase } = useData();
    return <img src={$withBase('/foo.png')} alt="foo"/>;
}
```

Note you can use the above syntax not only in theme components, but in your Markdown files as well.

````
```rc
const src = $withBase('/foo.png');
return <div><img src={src} alt="foo"/></div>
```
````

> But you don't need to use image follow this code. you just use `<img src="/foo.png" alt="foo"/>` will be fine, we will auto inject base url to result of render markdown.

Also, if a `base` is set, it’s automatically prepended to all asset URLs in `.mdpress/config.js` options.
