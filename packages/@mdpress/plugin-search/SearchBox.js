/* global SEARCH_MAX_SUGGESTIONS, SEARCH_PATHS, SEARCH_HOTKEYS */
import React,{ useState,useEffect,useRef } from 'react';
import { useHistory } from 'react-router-dom';
import classnames from 'classnames';
import useData from '@app/hooks/data';
import matchQuery from './match-query';
import './searchbox.styl';

function useSearchBoxData({ $site,$localePath }) {
  let history = useHistory();
  const [query,setQuery] = useState('');
  const [focused,setFocused] = useState(false);
  const [focusIndex,setFocusIndex] = useState(0);
  const [placeholder,setPlaceholder] = useState(undefined);
  const inputEl = useRef(null);

  const onHotkey = (event) => {
    if (event.srcElement === document.body && SEARCH_HOTKEYS.includes(event.key)) {
      inputEl.focus();
      event.preventDefault();
    }
  };
  useEffect(()=>{
    setPlaceholder($site.themeConfig.searchPlaceholder || '');
    document.addEventListener('keydown', onHotkey);

    return () => {
      document.removeEventListener('keydown', onHotkey);
    };

  },[]);

  const getPageLocalePath  = (page) => {
    for (const localePath in $site.locales || {}) {
      if (localePath !== '/' && page.path.indexOf(localePath) === 0) {
        return localePath;
      }
    }
    return '/';
  };

  const isSearchable  = (page) => {
    let searchPaths = SEARCH_PATHS;

    // all paths searchables
    if (searchPaths === null) { return true; }

    searchPaths = Array.isArray(searchPaths) ? searchPaths : new Array(searchPaths);

    return searchPaths.filter(path => {
      return page.path.match(path);
    }).length > 0;
  };

  const suggestions = (() => {
    const newQuery = query.trim().toLowerCase();
    if (!newQuery) {
      return;
    }

    const { pages,themeConfig } = $site;
    const max = themeConfig.searchMaxSuggestions || SEARCH_MAX_SUGGESTIONS;
    const localePath = $localePath;


    const res = [];
    for (let i = 0; i < pages.length; i++) {
      if (res.length >= max) break;
      const p = pages[i];
      // filter out results that do not match current locale
      if (getPageLocalePath(p) !== localePath) {
        continue;
      }

      // filter out results that do not match searchable paths
      if (!isSearchable(p)) {
        continue;
      }

      if (matchQuery(newQuery, p)) {
        res.push(p);
      } else if (p.headers) {
        for (let j = 0; j < p.headers.length; j++) {
          if (res.length >= max) break;
          const h = p.headers[j];
          if (h.title && matchQuery(newQuery, p, h.title)) {
            res.push(Object.assign({}, p, {
              path: p.path + '#' + h.slug,
              header: h
            }));
          }
        }
      }
    }
    return res;
  })();
  const showSuggestions = focused && suggestions && suggestions.length;
  const alignRight = (() => {
    const navCount = ($site.themeConfig.nav || []).length;
    const repo = $site.repo ? 1 : 0;
    return navCount + repo <= 2;
  })();

  const onUp = () => {
    if (showSuggestions) {
      if (focusIndex > 0) {
        setFocusIndex(focusIndex - 1);
      } else {
        setFocusIndex(suggestions.length - 1);
      }
    }
  };
  const onDown = () => {
    if (showSuggestions) {
      if (focusIndex < suggestions.length - 1) {
        setFocusIndex(focusIndex + 1);
      } else {
        setFocusIndex(0);
      }
    }
  };
  const go = (i) => {
    if (!showSuggestions) {
      return;
    }
    history.push(suggestions[i].path);
    setQuery('');
    setFocusIndex(0);
  };

  const focus = (i) => {
    setFocusIndex(i);
  };

  const unFocus = () => {
    setFocusIndex(-1);
  };
  return {
    query,
    setQuery,
    focused,
    setFocused,
    focusIndex,
    setFocusIndex,
    suggestions,
    showSuggestions,
    placeholder,
    onDown,
    onUp,
    go,
    focus,
    unFocus,
    alignRight,
    inputEl
  };
}

export default function SearchBox(){
  const { $site,$localePath } = useData();
  const {
    query,setQuery,
    setFocused,
    focusIndex,
    showSuggestions,
    suggestions,
    go,
    onUp,
    onDown,
    focus,
    unFocus,
    focused,
    alignRight,
    placeholder,
    inputEl
  } = useSearchBoxData({ $site,$localePath });

  const handleKeyUp = e => {
    switch (e.keyCode) {
    case '13': // enter
      go(focusIndex);
      break;
    case '38': // up
      onUp();
      break;
    case '40': // down
      onDown();
      break;
    default:
      return;
    }
  };
  return <div className="search-box">
    <input
      value={query}
      ref={inputEl}
      aria-label="Search"
      onChange={e => setQuery(e.target.value)}
      className={classnames({ 'focused': focused })}
      placeholder={placeholder}
      autoComplete="off"
      spellCheck="false"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyUp={handleKeyUp}
    />

    {!!showSuggestions && <ul
      onMouseLeave={unFocus}
      className={classnames('suggestions',{ 'align-right': alignRight })}
    >
      {suggestions.map((s,i) => {
        return  <li
          key={i}
          className={classnames('suggestion',{ focused: i === focusIndex })}
          onMouseDown={() => go(i)}
          onMouseEnter={() => focus(i)}
        >
          <a href={s.path} onClick={e => e.preventDefault()}>
            <span className="page-title">{s.title || s.path}</span>
            {s.header && <span className="header">&gt; {s.header.title}</span>}
          </a>
        </li>;
      })}
    </ul>}
  </div>;
}