(window.webpackJsonp=window.webpackJsonp||[]).push([[25],{535:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(e){var n=e.className,t=void 0===n?"":n,l=e.slotKey;return a.default.createElement(a.default.Fragment,null,a.default.createElement(r.default,{slotKey:l,className:t,markDownString:'\n# Local Development\n\n## Information\n\nIf you here you may be interested in improving core MdPress.\n\nMdPress is using a combo with [Yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) and [Lerna](https://github.com/lerna/lerna).\n\n## Init packages\n\n```bash\n yarn // it will install dependencies of all packages\n```\n\n`yarn` will use hoisting. What does it mean for you ?\n\nIt will regroup all dependencies in the workspace root and link all packages.\n\nCheck the link by running the following command:\n\n```bash\n    ls -la node_modules/@mdpress\n```\n\n:::warning\nYou have to take care to declare all dependencies inside subFolders package.json. When publish the lib if dependencies from a package is not declare it will just not work.\n:::\n\n:::warning\nThere is a special package you should have a look is @mdpress/shared-utils that are in typescript.\n:::\n\nAfter install everything it will run `yarn tsc`. This command will tell to @mdpress/shared-utils workspace to compile his js.\n\n:::warning\nFrom here if you are making change inside this package you will have to\nrun `yarn tsc` all the time or run in separate shell `yarn run tsc -w`. This will re run tsc at any change from shared-utils\n:::\n\n## Link\n\nGood from here you have everything ready. You need to link MdPress to your project.\n\n```bash\nyarn register-mdpress\n```\n\nYou will have something like this: `success Registered "mdpress".`\n\nIt will link the package MdPress from `packages/mdpress`. You will have access to MdPress cli and packages.\n\nThey are declared in the `packages/mdpress/package.json`\n\n```js\n{\n"main": "index.js",\n///\n"bin": {\n    "mdpress": "cli.js"\n  }\n  ///\n}\n```\n\nNow go to your project and run `yarn link mdpress`.\n\nYou should have it `success Using linked package for "mdpress".`\n\n## Unlink\n\nYou may want to unlink everything. For it in the workspace root folder. Run\n\n```bash\nyarn unregister-mdpress\n```\n\nNow you can run `yarn unlink mdpress` into your project folder.\n\nIf everything work properly you should have an error telling you there is no package found called mdpress, if you run `yarn link mdpress` in you project folder.\n\n## BUGS / QA\n\nYou will maybe find some difficulty with link. If you encounter something like `There\'s already a package called "mdpress" registered`.\nYou already have MdPress registered:\n\n- If you already link MdPress from [Link](#link). It’s totally fine. If you make changes because it is symlink you dont have to re run something. You will have to rerun yarn tsc if you update shared-utils package. Nothing more\n- If you didn’t do anything. You already have MdPress linked somewhere. What you have to do is deleting folder where you ran `yarn link` or `yarn unlink`.\n\n## More\n\nYou will have interesting commands available:\n\n- `yarn packages:list` will list you every packages present and their versions [More...](https://github.com/lerna/lerna/tree/master/commands/list#readme)\n- `yarn packages:changed` will tell you which package will be affect by the next lerna publish / version [More...](https://github.com/lerna/lerna/tree/master/commands/changed#readme)\n- `yarn packages:diff` will show you all diff from last release [More...](https://github.com/lerna/lerna/tree/master/commands/diff#readme)\n'}))};var a=l(t(0)),r=l(t(608));function l(e){return e&&e.__esModule?e:{default:e}}},604:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(){return l.default.createElement("svg",{className:"icon outbound",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",x:"0px",y:"0px",viewBox:"0 0 100 100",width:"15",height:"15"},l.default.createElement("path",{fill:"currentColor",d:"M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"}),l.default.createElement("polygon",{fill:"currentColor",points:"45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"}))};var a,r=t(0),l=(a=r)&&a.__esModule?a:{default:a};t(606)},605:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(e){var n=(0,r.default)().$page,t=e.pageKey,s=void 0===t?n.key:t,i=e.className,u=e.slotKey,d=void 0===u?"default":u;(0,o.setGlobalInfo)("pageKey",s);var c=l.default[s]||function(){return null};return a.default.createElement(c,{className:i,slotKey:d})};var a=s(t(0)),r=s(t(99)),l=s(t(164)),o=t(36);function s(e){return e&&e.__esModule?e:{default:e}}t(607)},606:function(e,n,t){},607:function(e,n,t){},608:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a=g(t(100)),r=g(t(29)),l=g(t(166)),o=t(0),s=g(o),i=g(t(4)),u=t(101),d=g(t(99)),c=g(t(102)),f=t(165),h=g(t(609)),m=g(t(605)),p=g(t(604)),y=g(t(37));function g(e){return e&&e.__esModule?e:{default:e}}var v="server"===(0,t(36).getEnv)();function k(e){var n=e.markDownString,t=e.className,i=e.slotKey,g=(0,o.useRef)(e.md||y.default.createMD()).current,k=(0,d.default)(),b=k.$site,M=k.$page,_=(0,o.useState)(null),N=(0,r.default)(_,2),E=N[0],j=N[1],I=(0,o.useRef)(null);return(0,o.useEffect)((function(){j(document.getElementById(i))}),[]),(0,o.useEffect)((function(){"default"!==i&&I&&E&&((0,a.default)(E.childNodes).forEach((function(e,n){var t=I.current.childNodes[n];t?I.current.replaceChild(e,t):I.current.appendChild(e)})),E.parentNode.removeChild(E))}),[E]),"default"!==i?s.default.createElement("div",{ref:I}):((0,f.useComponentWillMount)((function(){!function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};e.use((function(e){return(0,u.SupportReactComponent)(e,{allowErrorLog:!0,sandbox:(0,l.default)({},n,t),babelInit:function(e){e.availablePlugins.filterXSS&&(e.availablePlugins.filterXSS=function(){return{}})}})}))}(g,c.default,{$site:b,$page:M,JSON:JSON,ClientOnly:h.default,console:console,Content:m.default,OutboundLink:p.default,$withBase:function(e){var n=b.base;return"/"===e.charAt(0)?n+e.slice(1):e}})})),v?s.default.createElement(w,{html:g.render(n),slotKey:i,className:t}):(0,o.useMemo)((function(){var e=g.render(n);return s.default.createElement(w,{html:e,slotKey:i,className:t})}),[n,i,t]))}function w(e){var n=e.html,t=e.slotKey,a=e.className;return s.default.createElement("div",{className:"content content__"+t+" "+a,dangerouslySetInnerHTML:{__html:n}})}k.propTypes={markDownString:i.default.string,className:i.default.string,scrollAnchor:i.default.bool,mdInit:i.default.func,md:i.default.object},k.defaultProps={markDownString:"",className:"",scrollAnchor:!0,mdInit:function(){}},n.default=k},609:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a=o(t(29));n.default=function(e){var n=(0,r.useState)(!1),t=(0,a.default)(n,2),o=t[0],i=t[1],u=e.children,d=e.onSSR,c=void 0===d?l.default.createElement(s,null):d;return(0,r.useEffect)((function(){i(!0)}),[]),o?u:c};var r=t(0),l=o(r);function o(e){return e&&e.__esModule?e:{default:e}}var s=function(){return l.default.createElement("span",null)}}}]);