import React from 'react';
import useData from '@app/hooks/data';
import OutboundLink from '@app/components/OutboundLink';
import NavLink from './NavLink';
import DropdownLink from './DropdownLink';
import { resolveNavLinkItem } from '../util';
import '../styles/nav-links.styl';

const routes = require('@internal/routes').$routes;

export default function NavLinks(props) {
  const { $site,$themeLocaleConfig,$page,$lang,$localeConfig } = useData();

  const userNav = $themeLocaleConfig.nav || $site.themeConfig.nav || [];
  const nav = (() => {
    const { locales } = $site;
    if (locales && Object.keys(locales).length > 1) {
      const currentLink = $page.path;
      const themeLocales = $site.themeConfig.locales || {};
      const languageDropdown = {
        text: $themeLocaleConfig.selectText || 'Languages',
        ariaLabel: $themeLocaleConfig.ariaLabel || 'Select language',
        items: Object.keys(locales).map(path => {
          const locale = locales[path];
          const text = themeLocales[path] && themeLocales[path].label || locale.lang;
          let link;
          // Stay on the current page
          if (locale.lang === $lang) {
            link = currentLink;
          } else {
            // Try to stay on the same page
            link = currentLink.replace($localeConfig.path, path);
            // fallback to homepage
            if (Array.isArray(routes) && !routes.some(route => route.path === link)) {
              link = path;
            }
          }
          return { text, link };
        })
      };
      return [...userNav, languageDropdown];
    }
    return userNav;
  })();


  const userLinks = (() => {
    return (nav || []).map(link => {
      return Object.assign(resolveNavLinkItem(link), {
        items: (link.items || []).map(resolveNavLinkItem)
      });
    });
  })();

  const repoLink = (() => {
    const { repo } = $site.themeConfig;
    if (repo) {
      return /^https?:/.test(repo)
        ? repo
        : `https://github.com/${repo}`;
    }
    return null;
  })();

  const repoLabel = (()=>{
    if (!repoLink) return;
    if ($site.themeConfig.repoLabel) {
      return $site.themeConfig.repoLabel;
    }

    const repoHost = repoLink.match(/^https?:\/\/[^/]+/)[0];
    const platforms = ['GitHub', 'GitLab', 'Bitbucket'];
    for (let i = 0; i < platforms.length; i++) {
      const platform = platforms[i];
      if (new RegExp(platform, 'i').test(repoHost)) {
        return platform;
      }
    }

    return 'Source';
  })();

  return userLinks.length || repoLink ?
    <nav className={'nav-links ' + props.className}>

      {/*user links*/}
      {userLinks.map((item,index) => {
        return <div className={'nav-item'} key={item.link || index}>
          {item.type === 'links' ? <DropdownLink item={item}/> : <NavLink item={item}/>}
        </div>;
      })}

      {/*repo link*/}
      {repoLink && <a
        href={repoLink}
        className="repo-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {repoLabel}
        <OutboundLink/>
      </a>}
    </nav> : null;
}