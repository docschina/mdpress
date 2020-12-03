import React,{ useState,useEffect,useRef } from 'react';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import useData from '@app/hooks/data';
import SidebarButton from './SidebarButton';
import AlgoliaSearchBox from '@AlgoliaSearchBox';
import SearchBox from '@SearchBox';
import NavLinks from './NavLinks';
import '../styles/navbar.styl';

export default function Navbar(props) {
  const [linksWrapMaxWidth,setLinksWrapMaxWidth] = useState(null);
  const { $site,$page,$withBase,$themeLocaleConfig,$localePath,$siteTitle } = useData();
  const { toggleSidebar } = props;
  const el = useRef(null);
  const siteName = useRef(null);
  const algolia = $themeLocaleConfig.algolia || $site.themeConfig.algolia || {};
  const isAlgoliaSearch = algolia && algolia.apiKey && algolia.indexName;

  useEffect(()=>{
    const MOBILE_DESKTOP_BREAKPOINT = 719; // refer to config.styl
    const $el = el.current;
    const NAVBAR_VERTICAL_PADDING = parseInt(css($el, 'paddingLeft')) + parseInt(css($el, 'paddingRight'));

    const handleLinksWrapWidth = () => {
      if (document.documentElement.clientWidth < MOBILE_DESKTOP_BREAKPOINT) {
        setLinksWrapMaxWidth(null);
      } else {
        setLinksWrapMaxWidth($el.offsetWidth - NAVBAR_VERTICAL_PADDING -
            (siteName && siteName.current && siteName.current.offsetWidth || 0));
      }
    };
    handleLinksWrapWidth();

    window.addEventListener('resize', handleLinksWrapWidth, false);

    return () => {
      window.removeEventListener('resize', handleLinksWrapWidth, false);
    };
  },[]);

  return <header ref={el} className="navbar">
    <SidebarButton toggleSidebar={toggleSidebar}/>
    <NavLink className={'home-link'} to={$localePath}>
      {$site.themeConfig.logo && <img className="logo" src={$withBase($site.themeConfig.logo)} alt={$siteTitle}/>}
      {$siteTitle &&
      <span ref={siteName} className={classnames('site-name',{ 'can-hide': $site.themeConfig.logo })}>
        { $siteTitle }
      </span>
      }
    </NavLink>
    <div className="links" style={{
      maxWidth: linksWrapMaxWidth
    }}>
      {isAlgoliaSearch ? <AlgoliaSearchBox options={algolia}/> :
        $site.themeConfig.search !== false  && $page.frontmatter.search !== false ? <SearchBox/> : null}

      <NavLinks className="can-hide"/>
    </div>
  </header>;
}
function css (el, property) {
  // NOTE: Known bug, will return 'auto' if style value is 'auto'
  const win = el.ownerDocument.defaultView;
  // null means not to return pseudo styles
  return win.getComputedStyle(el, null)[property];
}