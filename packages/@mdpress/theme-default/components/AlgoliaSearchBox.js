import React,{ useState,useEffect,useRef } from 'react';
import useData from '@app/hooks/data';
import { useHistory } from 'react-router-dom';
import '../styles/algolia-search.styl';

export default function AlgoliaSearchBox(props) {
  const { $lang,$site } = useData();
  const history = useHistory();
  const el = useRef(null);

  const [placeholder,setPlaceholder] = useState(undefined);
  const { options } = props;

  const initialize = (userOptions, lang) => {
    Promise.all([
      import(/* webpackChunkName: "docsearch" */ 'docsearch.js/dist/cdn/docsearch.min.js'),
      import(/* webpackChunkName: "docsearch" */ 'docsearch.js/dist/cdn/docsearch.min.css')
    ]).then(([docsearch]) => {
      docsearch = docsearch.default;
      const { algoliaOptions = {} } = userOptions;
      docsearch(Object.assign(
        {},
        userOptions,
        {
          inputSelector: '#algolia-search-input',
          // #697 Make docsearch work well at i18n mode.
          algoliaOptions: Object.assign({
            'facetFilters': [`lang:${lang}`].concat(algoliaOptions.facetFilters || [])
          }, algoliaOptions),
          handleSelected: (input, event, suggestion) => {
            const { pathname, hash } = new URL(suggestion.url);
            const routepath = pathname.replace($site.base, '/');
            const _hash = decodeURIComponent(hash);
            history.push(`${routepath}${_hash}`);
          }
        }
      ));
    });
  };
  const update = (options, lang) => {
    if (el && el.current) {
      el.current.innerHTML = '<input id="algolia-search-input" class="search-query">';
      initialize(options, lang);
    }
  };

  useEffect(() => {
    update(options,$lang);
  },[options,$lang]);

  useEffect(() => {
    initialize(options, $lang);
    setPlaceholder($site.themeConfig.searchPlaceholder || '');

  },[]);

  return <form
    id="search-form"
    className="algolia-search-wrapper search-box"
    role="search"
    ref={el}
  >
    <input
      id="algolia-search-input"
      className="search-query"
      placeholder={placeholder}
    />
  </form>;
}