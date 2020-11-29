import { useEffect, useState } from 'react';
import unionBy from 'lodash/unionBy';
import { useComponentWillMount } from './lifecycle';
import useData from './data';

export default function updateMeta(props) {
  const { $site,$page = {}, $title, $lang, $description } = useData();
  const { staticContext } = props;
  const [currentMetaTags, setCurrentMetaTags] = useState([]);

  const getMergedMetaTags = (siteMeta) => {
    const pageMeta = $page.frontmatter.meta || [];
    // pageMetaTags have higher priority than siteMetaTags
    // description needs special attention as it has too many entries
    return unionBy([{ name: 'description', content: $description }],
      pageMeta, siteMeta, metaIdentifier);
  };

  useComponentWillMount(() => {
    const siteMeta = $site.headTags
      .filter(([headerType]) => headerType === 'meta')
      .map(([_, headerValue]) => headerValue); // eslint-disable-line

    if (staticContext) {
      const mergedMetaItems = getMergedMetaTags(siteMeta);

      staticContext.title = $title;
      staticContext.lang = $lang;
      staticContext.pageMeta = renderPageMeta(mergedMetaItems);
    }
  });

  const updateMeta = ({ $title, $lang }) => {
    document.title = $title;
    document.documentElement.lang = $lang;

    const newMetaTags = getMergedMetaTags();
    setCurrentMetaTags(updateMetaTags(newMetaTags, currentMetaTags));
  };

  // Other life cycles will only be called at client
  useEffect(()=>{
    // init currentMetaTags from DOM
    const currentMetaTags = [...document.querySelectorAll('meta')];
    setCurrentMetaTags(currentMetaTags);

  },[]);

  useEffect(() => {
    // update title / meta tags
    updateMeta({ $title, $lang });
    return () => {
      updateMetaTags(null, currentMetaTags);
    };
  }, [$title,$lang]);

}

/**
 * Replace currentMetaTags with newMetaTags
 * @param {Array<Object>} newMetaTags
 * @param {Array<HTMLElement>} currentMetaTags
 * @returns {Array<HTMLElement>}
 */
function updateMetaTags (newMetaTags, currentMetaTags) {
  if (currentMetaTags) {
    [...currentMetaTags]
      .filter(c => c.parentNode === document.head)
      .forEach(c => {
        const meta = Array.from(document.head.childNodes).find(item => item.outerHTML === c.outerHTML);
        meta && document.head.removeChild(meta);
      });
  }
  if (newMetaTags) {
    return newMetaTags.map(m => {
      const tag = document.createElement('meta');
      Object.keys(m).forEach(key => {
        tag.setAttribute(key, m[key]);
      });
      document.head.appendChild(tag);
      return tag;
    });
  }
}

/**
 * Try to identify a meta tag by name, property or itemprop
 *
 * Return a complete string if none provided
 * @param {Object} tag from frontmatter or siteMetaTags
 * @returns {String}
 */
function metaIdentifier (tag) {
  for (const item of ['name', 'property', 'itemprop']) {
    if (tag.hasOwnProperty(item)) return tag[item] + item;
  }
  return JSON.stringify(tag);
}

/**
 * Render meta tags
 *
 * @param {Array} meta
 * @returns {Array<string>}
 */

function renderPageMeta (meta) {
  if (!meta) return '';
  return meta.map(m => {
    let res = '<meta';
    Object.keys(m).forEach(key => {
      res += ` ${key}="${m[key]}"`;
    });
    return res + '>';
  }).join('\n    ');
}