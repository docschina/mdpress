import MarkdownIt from 'markdown-it';
import highlightLinesPlugin from '@mdpress/markdown/lib/highlightLines';
import highlight from './highlight';
import preWrapperPlugin from '@mdpress/markdown/lib/preWrapper';
import lineNumbersPlugin from '@mdpress/markdown/lib/lineNumbers';
import convertRouterLinkPlugin from './link';
import emojiPlugin from 'markdown-it-emoji';
import anchorPlugin from 'markdown-it-anchor';
import tocPlugin from 'markdown-it-table-of-contents';
import _slugify  from '@mdpress/shared-utils/lib/slugify';
import parseHeaders  from '@mdpress/shared-utils/lib/parseHeaders';
import snippetPlugin from './snippet';
import image from './image';

/**
 * Create markdown by config.
 */
export default (markdown = {}) => {
  const {
    externalLinks,
    anchor,
    toc,
    lineNumbers,
    config,
    extendMarkdown
  } = markdown;
  // allow user config slugify
  const slugify = markdown.slugify || _slugify;

  const md = new MarkdownIt({
    html: true,
    highlight
  });
  try {
    md
      // custom plugins
      .use(highlightLinesPlugin)
      .use(preWrapperPlugin)
      .use(snippetPlugin)
      .use(convertRouterLinkPlugin, Object.assign({
        target: '_blank',
        rel: 'noopener noreferrer'
      }, externalLinks))
      .use(image)

    // 3rd party plugins
      .use(emojiPlugin)
      .use(anchorPlugin, Object.assign({
        slugify,
        permalink: true,
        permalinkBefore: true,
        permalinkSymbol: '#'
      }, anchor))
      .use(tocPlugin, Object.assign({
        slugify,
        includeLevel: [2, 3],
        format: parseHeaders
      }, toc));

    // apply user config
    if (config) {
      markdown.config(md);
    }

    if (extendMarkdown) {
      markdown.extendMarkdown(md);
    }

    if (lineNumbers) {
      md.use(lineNumbersPlugin);
    }

    dataReturnable(md);

    // expose slugify
    md.slugify = slugify;

  } catch (e) {
    console.error(e);
  }

  return md;
};

function dataReturnable (md) {
  // override render to allow custom plugins return data
  const render = md.render;
  md.render = (...args) => {
    md.__data = {};
    const html = render.call(md, ...args);
    return html;
  };
}