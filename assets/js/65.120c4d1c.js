(window.webpackJsonp=window.webpackJsonp||[]).push([[65],{572:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(e){var n=e.className,t=void 0===n?"":n,l=e.slotKey;return a.default.createElement(a.default.Fragment,null,a.default.createElement(r.default,{slotKey:l,className:t,markDownString:"\n# 术语\n\n你可能会在文档中碰到一些陌生的概念，本节列出了文档中常见的术语，方便查阅、学习、插件/主题开发之用。\n\n## layout\n\n- Access: `$page.frontmatter.layout`\n\n当前页面所使用的布局组件名。\n\n## frontmatter\n\n- Access: `$page.frontmatter`\n\n当前页面的 `markdown` 文件中包裹在 `---` 中的配置，一般用于做一些页面级别的配置，参考 [Front Matter](../guide/frontmatter.md) 一节了解更多。\n\n## permalink\n\n- Access: `$page.frontmatter.permalink`\n\n永久链接，参考 [Permalinks](../guide/permalinks.md) 一节了解更多。\n\n## regularPath\n\n- Access: `$page.regularPath`\n\n当前页面基于目录结构生成的 URL。\n\n## path\n\n- Access: `$page.path`\n\n当前页面的实际 URL。在构建期生成路由时，一个页面的 URL 将优先使用 `permalink`，若不存在则降级到 `regularPath`。\n\n## headers\n\n- Access: `$page.headers`\n\n即 `markdown` 中那些以一个或多个 `#` 定义的标题。\n\n## siteConfig\n\n- Access: `$site | Context.siteConfig`\n\n即 `.mdpress/config.js`，译为 `站点配置`。\n\n## themeConfig\n\n- Access: `$themeConfig | Context.themeConfig`\n\n即 `.mdpress/config.js` 中 `themeConfig` 的值，是用户对当前所使用的主题的配置。\n\n## themePath\n\n- Access: `Context.themeAPI.theme.path`\n\n当前使用的主题的所在的绝对路径。\n\n## themeEntry\n\n- Access: `Context.themeAPI.theme.entry`\n\n主题的配置文件 `themePath/index.js`。\n\n## parentThemePath\n\n- Access: `Context.themeAPI.parentTheme.path`\n\n如果当前使用的主题是一个派生主题，那么 `parentThemePath` 就是指父主题的所在绝对路径。\n\n## parentThemeEntry\n\n- Access: `Context.themeAPI.parentTheme.entry`\n\n如果当前使用的主题是一个派生主题，那么 `parentThemePath` 就是指父主题的主题的配置文件 `parentThemePath/index.js`。\n\n"}))};var a=l(t(0)),r=l(t(608));function l(e){return e&&e.__esModule?e:{default:e}}},604:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(){return l.default.createElement("svg",{className:"icon outbound",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",x:"0px",y:"0px",viewBox:"0 0 100 100",width:"15",height:"15"},l.default.createElement("path",{fill:"currentColor",d:"M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"}),l.default.createElement("polygon",{fill:"currentColor",points:"45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"}))};var a,r=t(0),l=(a=r)&&a.__esModule?a:{default:a};t(606)},605:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(e){var n=(0,r.default)().$page,t=e.pageKey,o=void 0===t?n.key:t,s=e.className,c=e.slotKey,f=void 0===c?"default":c;(0,u.setGlobalInfo)("pageKey",o);var d=l.default[o]||function(){return null};return a.default.createElement(d,{className:s,slotKey:f})};var a=o(t(0)),r=o(t(99)),l=o(t(164)),u=t(36);function o(e){return e&&e.__esModule?e:{default:e}}t(607)},606:function(e,n,t){},607:function(e,n,t){},608:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a=v(t(100)),r=v(t(29)),l=v(t(166)),u=t(0),o=v(u),s=v(t(4)),c=t(101),f=v(t(99)),d=v(t(102)),i=t(165),m=v(t(609)),h=v(t(605)),p=v(t(604)),g=v(t(37));function v(e){return e&&e.__esModule?e:{default:e}}var y="server"===(0,t(36).getEnv)();function _(e){var n=e.markDownString,t=e.className,s=e.slotKey,v=(0,u.useRef)(e.md||g.default.createMD()).current,_=(0,f.default)(),P=_.$site,E=_.$page,w=(0,u.useState)(null),A=(0,r.default)(w,2),b=A[0],N=A[1],M=(0,u.useRef)(null);return(0,u.useEffect)((function(){N(document.getElementById(s))}),[]),(0,u.useEffect)((function(){"default"!==s&&M&&b&&((0,a.default)(b.childNodes).forEach((function(e,n){var t=M.current.childNodes[n];t?M.current.replaceChild(e,t):M.current.appendChild(e)})),b.parentNode.removeChild(b))}),[b]),"default"!==s?o.default.createElement("div",{ref:M}):((0,i.useComponentWillMount)((function(){!function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};e.use((function(e){return(0,c.SupportReactComponent)(e,{allowErrorLog:!0,sandbox:(0,l.default)({},n,t),babelInit:function(e){e.availablePlugins.filterXSS&&(e.availablePlugins.filterXSS=function(){return{}})}})}))}(v,d.default,{$site:P,$page:E,JSON:JSON,ClientOnly:m.default,console:console,Content:h.default,OutboundLink:p.default,$withBase:function(e){var n=P.base;return"/"===e.charAt(0)?n+e.slice(1):e}})})),y?o.default.createElement(C,{html:v.render(n),slotKey:s,className:t}):(0,u.useMemo)((function(){var e=v.render(n);return o.default.createElement(C,{html:e,slotKey:s,className:t})}),[n,s,t]))}function C(e){var n=e.html,t=e.slotKey,a=e.className;return o.default.createElement("div",{className:"content content__"+t+" "+a,dangerouslySetInnerHTML:{__html:n}})}_.propTypes={markDownString:s.default.string,className:s.default.string,scrollAnchor:s.default.bool,mdInit:s.default.func,md:s.default.object},_.defaultProps={markDownString:"",className:"",scrollAnchor:!0,mdInit:function(){}},n.default=_},609:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a=u(t(29));n.default=function(e){var n=(0,r.useState)(!1),t=(0,a.default)(n,2),u=t[0],s=t[1],c=e.children,f=e.onSSR,d=void 0===f?l.default.createElement(o,null):f;return(0,r.useEffect)((function(){s(!0)}),[]),u?c:d};var r=t(0),l=u(r);function u(e){return e&&e.__esModule?e:{default:e}}var o=function(){return l.default.createElement("span",null)}}}]);