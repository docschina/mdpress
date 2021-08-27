(window.webpackJsonp=window.webpackJsonp||[]).push([[70],{577:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(e){var n=e.className,t=void 0===n?"":n,r=e.slotKey;return a.default.createElement(a.default.Fragment,null,a.default.createElement(l.default,{slotKey:r,className:t,markDownString:"\n# [@mdpress/plugin-active-header-links](https://github.com/docschina/mdpress/tree/master/packages/@mdpress/plugin-active-header-links)\n\n> 页面滚动时自动激活侧边栏链接的插件\n\n## 安装\n\n```bash\nyarn add -D @mdpress/plugin-active-header-links\n# OR npm install -D @mdpress/plugin-active-header-links\n```\n\n## 使用\n\n```javascript\nmodule.exports = {\n  plugins: ['@mdpress/active-header-links']\n}\n```\n\n### 配置选项\n\n```javascript\nmodule.exports = {\n  plugins: ['@mdpress/active-header-links', {\n    sidebarLinkSelector: '.sidebar-link',\n    headerAnchorSelector: '.header-anchor'\n  }]\n}\n```\n\n## 选项\n\n### sidebarLinkSelector\n\n- 类型: `string`\n- 默认值: `.sidebar-link`\n\n### headerAnchorSelector\n\n- 类型: `string`\n- 默认值: `.header-anchor`\n"}))};var a=r(t(0)),l=r(t(608));function r(e){return e&&e.__esModule?e:{default:e}}},604:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(){return r.default.createElement("svg",{className:"icon outbound",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",x:"0px",y:"0px",viewBox:"0 0 100 100",width:"15",height:"15"},r.default.createElement("path",{fill:"currentColor",d:"M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"}),r.default.createElement("polygon",{fill:"currentColor",points:"45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"}))};var a,l=t(0),r=(a=l)&&a.__esModule?a:{default:a};t(606)},605:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(e){var n=(0,l.default)().$page,t=e.pageKey,o=void 0===t?n.key:t,s=e.className,d=e.slotKey,i=void 0===d?"default":d;(0,u.setGlobalInfo)("pageKey",o);var c=r.default[o]||function(){return null};return a.default.createElement(c,{className:s,slotKey:i})};var a=o(t(0)),l=o(t(99)),r=o(t(164)),u=t(36);function o(e){return e&&e.__esModule?e:{default:e}}t(607)},606:function(e,n,t){},607:function(e,n,t){},608:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a=g(t(100)),l=g(t(29)),r=g(t(166)),u=t(0),o=g(u),s=g(t(4)),d=t(101),i=g(t(99)),c=g(t(102)),f=t(165),m=g(t(609)),p=g(t(605)),v=g(t(604)),h=g(t(37));function g(e){return e&&e.__esModule?e:{default:e}}var b="server"===(0,t(36).getEnv)();function _(e){var n=e.markDownString,t=e.className,s=e.slotKey,g=(0,u.useRef)(e.md||h.default.createMD()).current,_=(0,i.default)(),S=_.$site,k=_.$page,E=(0,u.useState)(null),w=(0,l.default)(E,2),N=w[0],M=w[1],C=(0,u.useRef)(null);return(0,u.useEffect)((function(){M(document.getElementById(s))}),[]),(0,u.useEffect)((function(){"default"!==s&&C&&N&&((0,a.default)(N.childNodes).forEach((function(e,n){var t=C.current.childNodes[n];t?C.current.replaceChild(e,t):C.current.appendChild(e)})),N.parentNode.removeChild(N))}),[N]),"default"!==s?o.default.createElement("div",{ref:C}):((0,f.useComponentWillMount)((function(){!function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};e.use((function(e){return(0,d.SupportReactComponent)(e,{allowErrorLog:!0,sandbox:(0,r.default)({},n,t),babelInit:function(e){e.availablePlugins.filterXSS&&(e.availablePlugins.filterXSS=function(){return{}})}})}))}(g,c.default,{$site:S,$page:k,JSON:JSON,ClientOnly:m.default,console:console,Content:p.default,OutboundLink:v.default,$withBase:function(e){var n=S.base;return"/"===e.charAt(0)?n+e.slice(1):e}})})),b?o.default.createElement(y,{html:g.render(n),slotKey:s,className:t}):(0,u.useMemo)((function(){var e=g.render(n);return o.default.createElement(y,{html:e,slotKey:s,className:t})}),[n,s,t]))}function y(e){var n=e.html,t=e.slotKey,a=e.className;return o.default.createElement("div",{className:"content content__"+t+" "+a,dangerouslySetInnerHTML:{__html:n}})}_.propTypes={markDownString:s.default.string,className:s.default.string,scrollAnchor:s.default.bool,mdInit:s.default.func,md:s.default.object},_.defaultProps={markDownString:"",className:"",scrollAnchor:!0,mdInit:function(){}},n.default=_},609:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a=u(t(29));n.default=function(e){var n=(0,l.useState)(!1),t=(0,a.default)(n,2),u=t[0],s=t[1],d=e.children,i=e.onSSR,c=void 0===i?r.default.createElement(o,null):i;return(0,l.useEffect)((function(){s(!0)}),[]),u?d:c};var l=t(0),r=u(l);function u(e){return e&&e.__esModule?e:{default:e}}var o=function(){return r.default.createElement("span",null)}}}]);