(window.webpackJsonp=window.webpackJsonp||[]).push([[32],{542:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t=e.className,n=void 0===t?"":t,l=e.slotKey;return a.default.createElement(a.default.Fragment,null,a.default.createElement(o.default,{slotKey:l,className:n,markDownString:"\n# [@mdpress/plugin-last-updated](https://github.com/docschina/mdpress/tree/master/packages/@mdpress/plugin-last-updated)\n\n> last-updated plugin for MdPress\n\nIf you use the default theme, you don't need to install this plugin, because the plugin is already included in the `core` of MdPress, and you should use the [themeConfig.lastUpdated](../../theme/default-theme-config.md#last-updated) option directly.\n\nIf you use it at your custom theme, you'll need to handle the UI by yourself, and you can use __[$page.lastUpdated](../../guide/global-computed.md#page)__ to access the date string.\n\n## Usage\n\n```js\nmodule.exports = {\n  plugins: ['@mdpress/last-updated']\n}\n```\n\n## Options\n\n### transformer\n\n- Type: `(timestamp: number, lang: string) => string`\n- Default: `undefined`\n\nBy default, this plugin produces a 13-bit timestamp for each page, you can also pass in a transformer to convert it to any format that you want.\n\ne.g.\n\n``` javascript\nconst moment = require('moment');\n\nmodule.exports = {\n  plugins: [\n    [\n      '@mdpress/last-updated',\n      {\n        transformer: (timestamp, lang) => {\n          // Don't forget to install moment yourself\n          const moment = require('moment')\n          moment.locale(lang)\n          return moment(timestamp).fromNow()\n        }\n      }\n    ]\n  ]\n}\n```\n\n::: tip\nIf you are running in [i18n](../../guide/i18n.md) mode, you can also use the second argument `lang` to generate time strings for different languages.\n\nNote that in MdPress, we follow this spec: [W3C > Language tags in HTML and XML](https://en.wikipedia.org/wiki/Language_localisation), so `en-US` uses hyphens (`-`) instead of underscores (`_`). Please make sure that the library you are using follows this spec, otherwise please convert it yourself.\n:::\n\n### dateOptions\n\n- Type: `object`\n- Default: `undefined`\n\nYou can also pass in an options object to customize the timestamp output. For more properties check [`Date.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString) options argument\n\n```javascript\n\nmodule.exports = {\n  plugins: [\n    [\n      '@mdpress/last-updated',\n      {\n        dateOptions:{\n          hours12: false\n        }\n      }\n    ]\n  ]\n}\n```\n"}))};var a=l(n(0)),o=l(n(608));function l(e){return e&&e.__esModule?e:{default:e}}},604:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){return l.default.createElement("svg",{className:"icon outbound",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",x:"0px",y:"0px",viewBox:"0 0 100 100",width:"15",height:"15"},l.default.createElement("path",{fill:"currentColor",d:"M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"}),l.default.createElement("polygon",{fill:"currentColor",points:"45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"}))};var a,o=n(0),l=(a=o)&&a.__esModule?a:{default:a};n(606)},605:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t=(0,o.default)().$page,n=e.pageKey,r=void 0===n?t.key:n,s=e.className,i=e.slotKey,d=void 0===i?"default":i;(0,u.setGlobalInfo)("pageKey",r);var c=l.default[r]||function(){return null};return a.default.createElement(c,{className:s,slotKey:d})};var a=r(n(0)),o=r(n(99)),l=r(n(164)),u=n(36);function r(e){return e&&e.__esModule?e:{default:e}}n(607)},606:function(e,t,n){},607:function(e,t,n){},608:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=v(n(100)),o=v(n(29)),l=v(n(166)),u=n(0),r=v(u),s=v(n(4)),i=n(101),d=v(n(99)),c=v(n(102)),f=n(165),m=v(n(609)),p=v(n(605)),g=v(n(604)),h=v(n(37));function v(e){return e&&e.__esModule?e:{default:e}}var y="server"===(0,n(36).getEnv)();function _(e){var t=e.markDownString,n=e.className,s=e.slotKey,v=(0,u.useRef)(e.md||h.default.createMD()).current,_=(0,d.default)(),w=_.$site,S=_.$page,M=(0,u.useState)(null),E=(0,o.default)(M,2),N=E[0],k=E[1],O=(0,u.useRef)(null);return(0,u.useEffect)((function(){k(document.getElementById(s))}),[]),(0,u.useEffect)((function(){"default"!==s&&O&&N&&((0,a.default)(N.childNodes).forEach((function(e,t){var n=O.current.childNodes[t];n?O.current.replaceChild(e,n):O.current.appendChild(e)})),N.parentNode.removeChild(N))}),[N]),"default"!==s?r.default.createElement("div",{ref:O}):((0,f.useComponentWillMount)((function(){!function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};e.use((function(e){return(0,i.SupportReactComponent)(e,{allowErrorLog:!0,sandbox:(0,l.default)({},t,n),babelInit:function(e){e.availablePlugins.filterXSS&&(e.availablePlugins.filterXSS=function(){return{}})}})}))}(v,c.default,{$site:w,$page:S,JSON:JSON,ClientOnly:m.default,console:console,Content:p.default,OutboundLink:g.default,$withBase:function(e){var t=w.base;return"/"===e.charAt(0)?t+e.slice(1):e}})})),y?r.default.createElement(b,{html:v.render(t),slotKey:s,className:n}):(0,u.useMemo)((function(){var e=v.render(t);return r.default.createElement(b,{html:e,slotKey:s,className:n})}),[t,s,n]))}function b(e){var t=e.html,n=e.slotKey,a=e.className;return r.default.createElement("div",{className:"content content__"+n+" "+a,dangerouslySetInnerHTML:{__html:t}})}_.propTypes={markDownString:s.default.string,className:s.default.string,scrollAnchor:s.default.bool,mdInit:s.default.func,md:s.default.object},_.defaultProps={markDownString:"",className:"",scrollAnchor:!0,mdInit:function(){}},t.default=_},609:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=u(n(29));t.default=function(e){var t=(0,o.useState)(!1),n=(0,a.default)(t,2),u=n[0],s=n[1],i=e.children,d=e.onSSR,c=void 0===d?l.default.createElement(r,null):d;return(0,o.useEffect)((function(){s(!0)}),[]),u?i:c};var o=n(0),l=u(o);function u(e){return e&&e.__esModule?e:{default:e}}var r=function(){return l.default.createElement("span",null)}}}]);