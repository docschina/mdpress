(window.webpackJsonp=window.webpackJsonp||[]).push([[42],{550:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(e){var n=e.className,t=void 0===n?"":n,r=e.slotKey;return o.default.createElement(o.default.Fragment,null,o.default.createElement(a.default,{slotKey:r,className:t,markDownString:"# Theme Inheritance <Badge type=\"warning\" text=\"beta\" />\n\n## Concepts\n\nTo introduce this section, let’s start with some basic concepts:\n\n- **Atomic theme**：that is the parent theme, implemented entirely from scratch, like the default theme.\n- **Derived theme**：that is the child theme, created based on parent theme.\n\n::: tip\nFor now theme inheritance doesn’t support high-order inheritance, that means, a derived theme cannot be inherited.\n:::\n\n## Usage\n\nSuppose you want to create a theme inherited from the default theme, you only need to configure the [extend](./option-api.md#extend) option in your theme configuration:\n\n```js\nmodule.exports = {\n  extend: '@mdpress/theme-default'\n}\n```\n\n## Inheritance Strategy\n\nAll the capabilities of the parent theme will be `\"passed\"` to the child theme. For file-level conventions, child theme can override it by creating a file with the same name in the same location. For some theme configuration options, such as [globalLayout](./option-api.md#globallayout), child theme can override it by the same name configuration.\n\nThe [file-level conventions](./writing-a-theme.md#directory-structure) are as follows:\n\n- **Sandbox Components**，that is the React components under `theme/sandbox`.\n- **Components**，that is the React components under `theme/components`.\n- **Global Style and Palette**，that is `index.styl` and `palette.styl` under `theme/styles`.\n- **HTML Template**, that is `dev.html` and `ssr.html` under `theme/templates`.\n- **Theme-Level App Enhancement File**，that is `theme/enhanceApp.js`\n\nFor theme configuration, the configuration options that can be overrode by child theme are as follows:\n\n- [devTemplate](./option-api.md#devtemplate)\n- [ssrTemplate](./option-api.md#ssrtemplate)\n- [globalLayout](./option-api.md#globallayout)\n\nTheme configuration options that cannot be overrode by child theme:\n\n- [extend](./option-api.md#extend)\n\nTheme configuration options requiring special treatment:\n\n- [plugins](./option-api.md#plugins)：See [Override Plugins](#override-plugins)。\n\n## Override Plugins\n\nFor [plugins](./option-api.md#plugins) in the parent theme, the child theme cannot override it intuitively, but the options of plugin can be overrode by creating plugin configuration with the same name.\n\nFor example, if the parent theme has the following configuration:\n\n```js\n// parentThemePath/index.js\nmodule.exports = {\n  plugins: [\n    ['@mdpress/search', {\n      searchMaxSuggestions: 5\n    }]\n  ]\n}\n```\n\nThe child theme can edit the options of plugin in the following ways:\n\n```js\n// themePath/index.js\nmodule.exports = {\n  plugins: [\n    ['@mdpress/search', {\n      searchMaxSuggestions: 10\n    }]\n  ]\n}\n```\n\nChild theme can even disable it:\n\n```js\n// themePath/index.js\nmodule.exports = {\n  plugins: [\n    ['@mdpress/search', false]\n  ]\n}\n```\n\n::: warning\nYou shouldn’t need to do this unless you know for sure that disabling plugins in parent themes won’t cause problems.\n:::\n\n## Override Components\n\nYou may want to override the same-name components in the parent theme. By default, when the components in the parent theme use relative paths to reference other components, you will not be able to do this because you cannot edit the code of the parent theme at runtime.\n\nMdPress achieves this requirement in a clever way, but there is a requirement for the parent theme - **All components must use the `@theme` alias to refer to other components**.\n\nFor example, if you are developing an atomic theme with the following structure:\n\n::: file\ntheme\n├── components\n│   ├── `Home.js`\n│   ├── `Navbar.js`\n│   └── `Sidebar.js`\n├── layouts\n│   ├── `404.js`\n│   └── `Layout.js`\n├── package.json\n└── index.js\n:::\n\nThen, in any React components on the theme, **you should access the theme root directory through `@theme`**:\n\n```jsx\nimport Navbar from '@theme/components/Navbar.js'\n// ...\n```\n\nOn this premise, when you create a `Navbar` component in the same place in the child theme\n\n::: file\ntheme\n└── components\n    └── `Navbar.js`\n:::\n\n`@theme/components/Navbar.js` will automatically map to the Navbar component in the child theme, and when you remove the component, `@theme/components/Navbar.js` will automatically restore to the Navbar component in the parent theme.\n\nThis way, you can \"tamper\" with some part of an atomic theme.\n\n\x3c!-- textlint-disable en-capitalization --\x3e\n\n::: tip\n1. You’d better override the component based on the code of the corresponding component in the parent theme.\n2. When developing theme locally, you need to manually restart the dev server when a component is created or removed.\n:::\n\n\x3c!-- textlint-enable --\x3e\n\n## Access Parent Theme\n\nYou can use `@parent-theme` to access the root path of the parent theme. The following example shows creating a layout component with the same name in a child theme and using slots in the parent theme. \n\n```jsx\n// themePath/components/Foo.js\nimport ParentLayout from '@parent-theme/layouts/Layout.js'\nimport Foo from '@theme/components/Foo.js'\n\nexport default function Layout(){\n  return <ParentLayout>\n             <Foo/>\n         </ParentLayout>\n}\n```\n\n\n\n\n\n"}))};var o=r(t(0)),a=r(t(608));function r(e){return e&&e.__esModule?e:{default:e}}},604:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(){return r.default.createElement("svg",{className:"icon outbound",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",x:"0px",y:"0px",viewBox:"0 0 100 100",width:"15",height:"15"},r.default.createElement("path",{fill:"currentColor",d:"M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"}),r.default.createElement("polygon",{fill:"currentColor",points:"45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"}))};var o,a=t(0),r=(o=a)&&o.__esModule?o:{default:o};t(606)},605:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(e){var n=(0,a.default)().$page,t=e.pageKey,l=void 0===t?n.key:t,s=e.className,u=e.slotKey,h=void 0===u?"default":u;(0,i.setGlobalInfo)("pageKey",l);var c=r.default[l]||function(){return null};return o.default.createElement(c,{className:s,slotKey:h})};var o=l(t(0)),a=l(t(99)),r=l(t(164)),i=t(36);function l(e){return e&&e.__esModule?e:{default:e}}t(607)},606:function(e,n,t){},607:function(e,n,t){},608:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=g(t(100)),a=g(t(29)),r=g(t(166)),i=t(0),l=g(i),s=g(t(4)),u=t(101),h=g(t(99)),c=g(t(102)),m=t(165),d=g(t(609)),p=g(t(605)),f=g(t(604)),v=g(t(37));function g(e){return e&&e.__esModule?e:{default:e}}var y="server"===(0,t(36).getEnv)();function b(e){var n=e.markDownString,t=e.className,s=e.slotKey,g=(0,i.useRef)(e.md||v.default.createMD()).current,b=(0,h.default)(),x=b.$site,j=b.$page,N=(0,i.useState)(null),S=(0,a.default)(N,2),_=S[0],E=S[1],P=(0,i.useRef)(null);return(0,i.useEffect)((function(){E(document.getElementById(s))}),[]),(0,i.useEffect)((function(){"default"!==s&&P&&_&&((0,o.default)(_.childNodes).forEach((function(e,n){var t=P.current.childNodes[n];t?P.current.replaceChild(e,t):P.current.appendChild(e)})),_.parentNode.removeChild(_))}),[_]),"default"!==s?l.default.createElement("div",{ref:P}):((0,m.useComponentWillMount)((function(){!function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};e.use((function(e){return(0,u.SupportReactComponent)(e,{allowErrorLog:!0,sandbox:(0,r.default)({},n,t),babelInit:function(e){e.availablePlugins.filterXSS&&(e.availablePlugins.filterXSS=function(){return{}})}})}))}(g,c.default,{$site:x,$page:j,JSON:JSON,ClientOnly:d.default,console:console,Content:p.default,OutboundLink:f.default,$withBase:function(e){var n=x.base;return"/"===e.charAt(0)?n+e.slice(1):e}})})),y?l.default.createElement(w,{html:g.render(n),slotKey:s,className:t}):(0,i.useMemo)((function(){var e=g.render(n);return l.default.createElement(w,{html:e,slotKey:s,className:t})}),[n,s,t]))}function w(e){var n=e.html,t=e.slotKey,o=e.className;return l.default.createElement("div",{className:"content content__"+t+" "+o,dangerouslySetInnerHTML:{__html:n}})}b.propTypes={markDownString:s.default.string,className:s.default.string,scrollAnchor:s.default.bool,mdInit:s.default.func,md:s.default.object},b.defaultProps={markDownString:"",className:"",scrollAnchor:!0,mdInit:function(){}},n.default=b},609:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=i(t(29));n.default=function(e){var n=(0,a.useState)(!1),t=(0,o.default)(n,2),i=t[0],s=t[1],u=e.children,h=e.onSSR,c=void 0===h?r.default.createElement(l,null):h;return(0,a.useEffect)((function(){s(!0)}),[]),i?u:c};var a=t(0),r=i(a);function i(e){return e&&e.__esModule?e:{default:e}}var l=function(){return r.default.createElement("span",null)}}}]);