import prism from 'prismjs';
import 'prismjs/components/prism-markdown.min';
import 'prismjs/components/prism-jsx.min';

prism.manual = true;

function wrap (code, lang) {
  return `<pre class="language-${lang}"><code>${code}</code></pre>`;
}

export default (str = '', lang) => {
  if (!lang) {
    lang = 'text';
  }
  const rawLang = lang;
  if (lang === 'vue' || lang === 'html') {
    lang = 'markup';
  }
  if (lang === 'md') {
    lang = 'markdown';
  }
  if (prism.languages[lang]) {
    const code = prism.highlight(str, prism.languages[lang], lang);
    return wrap(code, rawLang);
  }
  const code = prism.highlight(str, prism.languages['markdown'], 'markdown');
  return wrap(code, 'text');
};
