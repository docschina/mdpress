import layoutComponents from '@internal/layout-components';
import pageComponents from '@internal/page-components';
import sandbox from '@internal/sandbox';
import Loadable from './lazy/Loadable';

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  const cache = Object.create(null);
  // eslint-disable-next-line func-names
  return function cachedFn (str) {
    const hit = cache[str];
    // eslint-disable-next-line no-return-assign
    return hit || (cache[str] = fn(str));
  };
}

/**
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g;
const camelize = cached(str => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '');
});

/**
 * Hyphenate a camelCase string.
 */
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cached(str => {
  return str.replace(hyphenateRE, '-$1').toLowerCase();
});

/**
 * Capitalize a string.
 */
const capitalize = cached(str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

/**
 * This method was for securely getting React component when components
 * are named in different style.
 *
 * e.g. a component named `a-b` can be also getted by `AB`, It's the
 * same the other way round
 *
 * @param {function} getter a function of getting component by name
 * @param {string} name component's name
 * @returns {Component|AsyncComponent}
 */
export function getComponent (getter, name) {
  if (!name) return;
  if (getter(name)) return getter(name);

  const isKebabCase = name.includes('-');
  if (isKebabCase) return getter(capitalize(camelize(name)));

  return getter(capitalize(name)) || getter(hyphenate(name));
}

const asyncComponents = Object.assign({}, layoutComponents, pageComponents,sandbox);
const asyncComponentsGetter = name => asyncComponents[name];
const pageComponentsGetter = layout => pageComponents[layout];
const layoutComponentsGetter = layout => layoutComponents[layout];
const sandboxComponentsGetter = name => sandbox[name];
const globalComponentsGetter = name => Loadable.loadedMap[name];

export function getPageAsyncComponent (pageKey) {
  return getComponent(pageComponentsGetter, pageKey);
}

export function getLayoutAsyncComponent (layout) {
  return getComponent(layoutComponentsGetter, layout);
}

export function getSandboxAsyncComponent (name) {
  return getComponent(sandboxComponentsGetter, name);
}

export function getAsyncComponent (name) {
  return getComponent(asyncComponentsGetter, name);
}

export function getSyncComponent (name) {
  return getComponent(globalComponentsGetter, name);
}

export function findPageForPath (pages, path) {
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    if (page.path === path) {
      return page;
    }
  }
  return {
    path: '',
    frontmatter: {}
  };
}

export function findPageByKey (pages, key) {
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    if (page.key === key) {
      return page;
    }
  }
  return {
    path: '',
    frontmatter: {}
  };
}

/**
 * Normalize config.
 * This utility is mainly for plugin developers. For some
 * plugins that need internationalize the text. but it's
 * not recommenbded to let plugin care about to the internal
 * i18n implementation, so this utility was born.
 *
 *
 * Usage:
 *
 * import { normalizeConfig } from '@app/util'
 * export default {
 *   data () {
 *     return { config }
 *   }
 *   computed: {
 *     normalizedConfig() {
 *       return normalizeConfig(this, config)
 *     }
 *   }
 * }
 *
 *
 * e.g.
 *
 * Config: : 'Text'
 * Normalized Config: 'Text'
 *
 * Config: : { '/': 'Text', '/zh/': '文本' }
 * Normalized Config: 'Text' or '文本'
 *
 * @param {any} props
 * @param {any} rawConfig
 * @returns {any}
 */
export function normalizeConfig (props, rawConfig) {
  const { $localePath } = props;
  if (typeof rawConfig === 'object' && rawConfig[$localePath]) {
    return rawConfig[$localePath];
  }
  return rawConfig;
}

/**
 * Set global info in `window.__MDPRESS__` for debugging.
 *
 * @param {string}key
 * @param {any} value
 */
export function setGlobalInfo (key, value) {
  if (typeof window === 'undefined' || !window.__MDPRESS__) {
    return;
  }
  window.__MDPRESS__[key] = value;
}

function isNumber (v) {
  return typeof v === 'number';
}

export function normalizeOffset (dom) {
  let offset =
      dom.offset && typeof dom.offset === 'object'
        ? dom.offset
        : {};
  return {
    x: isNumber(offset.x) ? offset.x : 0,
    y: isNumber(offset.y) ? offset.y : 0
  };
}

export function getElementPosition (el, offset) {
  const docEl = document.documentElement;
  const docRect = docEl.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left - offset.x,
    y: elRect.top - docRect.top - offset.y
  };
}

export function getEnv() {
  return typeof window === 'undefined' ? 'server' : 'browser';
}