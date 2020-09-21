---
home: true
heroImage: /hero.png
actionText: Get Started →
actionLink: /guide/
footer: MIT Licensed | Copyright © 2020-present LinFeng1997
---

<div style="text-align: center">
  
</div>

<div class="features">  
  <div class="feature">
    <h2>Simplicity First</h2>
    <p>Minimal setup with markdown-centered project structure helps you focus on writing.</p>
  </div>
  <div class="feature">
    <h2>Markdown-Powered</h2>
    <p>Enjoy the dev experience of webpack, use React components in markdown, and develop custom themes with React.</p>
  </div>
  <div class="feature">
    <h2>Performant</h2>
    <p>MdPress generates pre-rendered static HTML for each page, and runs as an SPA once a page is loaded.</p>
  </div>
</div>

### As Easy as 1, 2, 3

``` bash
# install
yarn global add mdpress
# OR npm install -g mdpress

# create a markdown file
echo '# Hello MdPress' > README.md

# start writing
mdpress dev

# build to static files
mdpress build
```

::: warning COMPATIBILITY NOTE
MdPress requires Node.js >= 8.6.
:::
