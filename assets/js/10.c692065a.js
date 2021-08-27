(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{519:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t=e.className,n=void 0===t?"":t,i=e.slotKey;return a.default.createElement(a.default.Fragment,null,a.default.createElement(o.default,{slotKey:i,className:n,markDownString:"# Introduction\n\nMdPress is composed of two parts: a [minimalistic site generator](https://github.com/docschina/mdpress/tree/master/packages/%40mdpress/core) with a React-powered [theming system](../theme/README.md) and [Plugin API](../plugin/README.md), and a [default theme](../theme/default-theme-config.md) optimized for writing technical documentation. It was created to support the documentation needs of docschina’s own sub projects.\n\nEach page generated by MdPress has its own pre-rendered static HTML, providing great loading performance and is SEO-friendly. Yet, once the page is loaded, React takes over the static content and turns it into a full Single-Page Application (SPA). Extra pages are fetched on demand as the user navigates around the site.\n\nIf your page data is stored on the service side, you can also render them by writing specific plugins.\n## How It Works\n\nA MdPress site is in fact a SPA powered by [React](https://reactjs.org/)、[React Router](https://reacttraining.com/react-router/) and [Webpack](http://webpack.js.org/). If you’ve used React before, you will notice the familiar development experience when you are writing or developing custom themes (you can even use React DevTools to debug your custom theme!).\n\nDuring the build, we create a server-rendered version of the app and render the corresponding HTML by virtually visiting each route. This approach is inspired by [Nuxt](https://nuxtjs.org/)'s `nuxt generate` command and other projects like [Gatsby](https://www.gatsbyjs.org/) and Vuepress.\n\nEach Markdown file is compiled into HTML with [markdown-it](https://github.com/markdown-it/markdown-it) and then processed as the template of a React component. This allows you to directly use React inside your Markdown files and is great when you need to embed dynamic content.\n\n## Features\n\n**Built-in Markdown extensions**\n\n* [Table of Contents](../guide/markdown.md#table-of-contents)\n* [Custom Containers](../guide/markdown.md#custom-containers)\n* [Line Highlighting](../guide/markdown.md#line-highlighting-in-code-blocks)\n* [Line Numbers](../guide/markdown.md#line-numbers)\n* [Import Code Snippets](../guide/markdown.md#import-code-snippets)\n\n**Using React in Markdown**\n\n* [Using Components](../guide/using-react.md#using-components)\n\n**React-powered custom theme system**\n\n* [Metadata](../theme/writing-a-theme.md#site-and-page-metadata)\n* [Content Excerpt](../theme/writing-a-theme.md#content-excerpt)\n\n**Default theme**\n\n* Responsive layout\n* [Optional Homepage](../theme/default-theme-config.md#homepage)\n* [Simple out-of-the-box header-based search](../theme/default-theme-config.md#built-in-search)\n* [Algolia Search](../theme/default-theme-config.md#algolia-search)\n* Customizable [navbar](../theme/default-theme-config.md#navbar) and [sidebar](../theme/default-theme-config.md#sidebar)\n* [Auto-generated GitHub link and page edit links](../theme/default-theme-config.md#git-repo-and-edit-links)\n* [PWA: Popup UI to refresh contents](../theme/default-theme-config.md#popup-ui-to-refresh-contents)\n* [Last Updated](../theme/default-theme-config.md#last-updated)\n* [Multi-Language Support](../guide/i18n.md)\n\n**Plugin**\n\n* [Powerful Plugin API](../plugin/README.md)\n* [Search Plugin](../plugin/official/plugin-search.md)\n* [PWA Plugin](../plugin/official/plugin-pwa.md)\n* [Google Analytics Plugin](../plugin/official/plugin-google-analytics.md)\n* ...\n\n## Why Not ...?\n\n### Vuepress\nVuepress have a great design, and this project use for reference its design and code, but it only renders Markdown stored in the local file system, not Markdown stored on the service side.\n\n### Nuxt\n\nNuxt is capable of doing what MdPress does, but it’s designed for building applications. MdPress is focused on content-centric sites and provides features tailored for technical documentation out of the box.\n\n### Docsify / Docute\n\nBoth are great projects are both fully runtime-driven and therefore not SEO-friendly. If you don’t care for SEO and don’t want to mess with installing dependencies, these are still great choices.\n\n### Hexo\n\nin fact, we are probably still a long way to go from migrating away from it for our main site. The biggest problem is that its theming system is static and string-based - we want to take advantage of React for both the layout and the interactivity. Also, Hexo’s Markdown rendering isn’t the most flexible to configure.\n\n### GitBook\n\nThe primary problem with GitBook is that its development reload performance is intolerable with a large amount of files. The default theme also has a pretty limiting navigation structure, and the theming system is, again, not React based. The team behind GitBook is also more focused on turning it into a commercial product rather than an open-source tool.\n"}))};var a=i(n(0)),o=i(n(608));function i(e){return e&&e.__esModule?e:{default:e}}},604:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){return i.default.createElement("svg",{className:"icon outbound",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",x:"0px",y:"0px",viewBox:"0 0 100 100",width:"15",height:"15"},i.default.createElement("path",{fill:"currentColor",d:"M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"}),i.default.createElement("polygon",{fill:"currentColor",points:"45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"}))};var a,o=n(0),i=(a=o)&&a.__esModule?a:{default:a};n(606)},605:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t=(0,o.default)().$page,n=e.pageKey,s=void 0===n?t.key:n,d=e.className,l=e.slotKey,u=void 0===l?"default":l;(0,r.setGlobalInfo)("pageKey",s);var c=i.default[s]||function(){return null};return a.default.createElement(c,{className:d,slotKey:u})};var a=s(n(0)),o=s(n(99)),i=s(n(164)),r=n(36);function s(e){return e&&e.__esModule?e:{default:e}}n(607)},606:function(e,t,n){},607:function(e,t,n){},608:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=w(n(100)),o=w(n(29)),i=w(n(166)),r=n(0),s=w(r),d=w(n(4)),l=n(101),u=w(n(99)),c=w(n(102)),f=n(165),m=w(n(609)),h=w(n(605)),g=w(n(604)),p=w(n(37));function w(e){return e&&e.__esModule?e:{default:e}}var v="server"===(0,n(36).getEnv)();function b(e){var t=e.markDownString,n=e.className,d=e.slotKey,w=(0,r.useRef)(e.md||p.default.createMD()).current,b=(0,u.default)(),k=b.$site,M=b.$page,E=(0,r.useState)(null),P=(0,o.default)(E,2),S=P[0],_=P[1],N=(0,r.useRef)(null);return(0,r.useEffect)((function(){_(document.getElementById(d))}),[]),(0,r.useEffect)((function(){"default"!==d&&N&&S&&((0,a.default)(S.childNodes).forEach((function(e,t){var n=N.current.childNodes[t];n?N.current.replaceChild(e,n):N.current.appendChild(e)})),S.parentNode.removeChild(S))}),[S]),"default"!==d?s.default.createElement("div",{ref:N}):((0,f.useComponentWillMount)((function(){!function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};e.use((function(e){return(0,l.SupportReactComponent)(e,{allowErrorLog:!0,sandbox:(0,i.default)({},t,n),babelInit:function(e){e.availablePlugins.filterXSS&&(e.availablePlugins.filterXSS=function(){return{}})}})}))}(w,c.default,{$site:k,$page:M,JSON:JSON,ClientOnly:m.default,console:console,Content:h.default,OutboundLink:g.default,$withBase:function(e){var t=k.base;return"/"===e.charAt(0)?t+e.slice(1):e}})})),v?s.default.createElement(y,{html:w.render(t),slotKey:d,className:n}):(0,r.useMemo)((function(){var e=w.render(t);return s.default.createElement(y,{html:e,slotKey:d,className:n})}),[t,d,n]))}function y(e){var t=e.html,n=e.slotKey,a=e.className;return s.default.createElement("div",{className:"content content__"+n+" "+a,dangerouslySetInnerHTML:{__html:t}})}b.propTypes={markDownString:d.default.string,className:d.default.string,scrollAnchor:d.default.bool,mdInit:d.default.func,md:d.default.object},b.defaultProps={markDownString:"",className:"",scrollAnchor:!0,mdInit:function(){}},t.default=b},609:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=r(n(29));t.default=function(e){var t=(0,o.useState)(!1),n=(0,a.default)(t,2),r=n[0],d=n[1],l=e.children,u=e.onSSR,c=void 0===u?i.default.createElement(s,null):u;return(0,o.useEffect)((function(){d(!0)}),[]),r?l:c};var o=n(0),i=r(o);function r(e){return e&&e.__esModule?e:{default:e}}var s=function(){return i.default.createElement("span",null)}}}]);