(window.webpackJsonp=window.webpackJsonp||[]).push([[44],{552:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t=e.className,n=void 0===t?"":t,r=e.slotKey;return a.default.createElement(a.default.Fragment,null,a.default.createElement(l.default,{slotKey:r,className:n,markDownString:"# Using a theme\n\nUsing a theme is almost the same as using a plugin.\n\n## Using a theme from a dependency\n\nThemes can be published on npm in raw Component SFC format as `mdpress-theme-xxx`.\n\n``` js\nmodule.exports = {\n  theme: 'mdpress-theme-xx'\n}\n```\n\n## Theme Shorthand\n\nIf you prefix the theme with `mdpress-theme-`, you can use a shorthand to leave out that prefix:\n\n``` js\nmodule.exports = {\n  theme: 'xxx'\n}\n```\n\nSame with:\n\n``` js\nmodule.exports = {\n  theme: 'mdpress-theme-xxx'\n}\n```\n\nThis also works with [Scoped Packages](https://docs.npmjs.com/misc/scope):\n\n``` js\nmodule.exports = {\n  theme: '@org/mdpress-theme-xxx', // or an official theme: '@mdpress/theme-xxx'\n}\n```\n\nShorthand:\n\n``` js\nmodule.exports = {\n  theme: '@org/xxx', // or an official theme: '@mdpress/xxx'\n}\n```\n\n::: warning Note\nThe theme whose name starts with `@mdpress/theme-` is an officially maintained theme.\n:::\n"}))};var a=r(n(0)),l=r(n(608));function r(e){return e&&e.__esModule?e:{default:e}}},604:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){return r.default.createElement("svg",{className:"icon outbound",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",x:"0px",y:"0px",viewBox:"0 0 100 100",width:"15",height:"15"},r.default.createElement("path",{fill:"currentColor",d:"M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"}),r.default.createElement("polygon",{fill:"currentColor",points:"45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"}))};var a,l=n(0),r=(a=l)&&a.__esModule?a:{default:a};n(606)},605:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t=(0,l.default)().$page,n=e.pageKey,o=void 0===n?t.key:n,s=e.className,d=e.slotKey,i=void 0===d?"default":d;(0,u.setGlobalInfo)("pageKey",o);var c=r.default[o]||function(){return null};return a.default.createElement(c,{className:s,slotKey:i})};var a=o(n(0)),l=o(n(99)),r=o(n(164)),u=n(36);function o(e){return e&&e.__esModule?e:{default:e}}n(607)},606:function(e,t,n){},607:function(e,t,n){},608:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=x(n(100)),l=x(n(29)),r=x(n(166)),u=n(0),o=x(u),s=x(n(4)),d=n(101),i=x(n(99)),c=x(n(102)),f=n(165),m=x(n(609)),h=x(n(605)),p=x(n(604)),v=x(n(37));function x(e){return e&&e.__esModule?e:{default:e}}var g="server"===(0,n(36).getEnv)();function w(e){var t=e.markDownString,n=e.className,s=e.slotKey,x=(0,u.useRef)(e.md||v.default.createMD()).current,w=(0,i.default)(),_=w.$site,S=w.$page,b=(0,u.useState)(null),E=(0,l.default)(b,2),N=E[0],M=E[1],j=(0,u.useRef)(null);return(0,u.useEffect)((function(){M(document.getElementById(s))}),[]),(0,u.useEffect)((function(){"default"!==s&&j&&N&&((0,a.default)(N.childNodes).forEach((function(e,t){var n=j.current.childNodes[t];n?j.current.replaceChild(e,n):j.current.appendChild(e)})),N.parentNode.removeChild(N))}),[N]),"default"!==s?o.default.createElement("div",{ref:j}):((0,f.useComponentWillMount)((function(){!function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};e.use((function(e){return(0,d.SupportReactComponent)(e,{allowErrorLog:!0,sandbox:(0,r.default)({},t,n),babelInit:function(e){e.availablePlugins.filterXSS&&(e.availablePlugins.filterXSS=function(){return{}})}})}))}(x,c.default,{$site:_,$page:S,JSON:JSON,ClientOnly:m.default,console:console,Content:h.default,OutboundLink:p.default,$withBase:function(e){var t=_.base;return"/"===e.charAt(0)?t+e.slice(1):e}})})),g?o.default.createElement(y,{html:x.render(t),slotKey:s,className:n}):(0,u.useMemo)((function(){var e=x.render(t);return o.default.createElement(y,{html:e,slotKey:s,className:n})}),[t,s,n]))}function y(e){var t=e.html,n=e.slotKey,a=e.className;return o.default.createElement("div",{className:"content content__"+n+" "+a,dangerouslySetInnerHTML:{__html:t}})}w.propTypes={markDownString:s.default.string,className:s.default.string,scrollAnchor:s.default.bool,mdInit:s.default.func,md:s.default.object},w.defaultProps={markDownString:"",className:"",scrollAnchor:!0,mdInit:function(){}},t.default=w},609:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=u(n(29));t.default=function(e){var t=(0,l.useState)(!1),n=(0,a.default)(t,2),u=n[0],s=n[1],d=e.children,i=e.onSSR,c=void 0===i?r.default.createElement(o,null):i;return(0,l.useEffect)((function(){s(!0)}),[]),u?d:c};var l=n(0),r=u(l);function u(e){return e&&e.__esModule?e:{default:e}}var o=function(){return r.default.createElement("span",null)}}}]);