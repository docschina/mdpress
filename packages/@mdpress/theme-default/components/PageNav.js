import React from 'react';
import { NavLink } from 'react-router-dom';
import OutboundLink from '@app/components/OutboundLink';
import useData from '@app/hooks/data';
import { resolvePage } from '../util';
import isString from 'lodash/isString';
import isNil from 'lodash/isNil';
import '../styles/page-nav.styl';

export default function PageEdit(props) {
  const { sidebarItems } = props;
  const { $page,$site,$route,$themeConfig } = useData();

  const prev = (() => {
    return resolvePageLink(LINK_TYPES.PREV, { $themeConfig, $page, $route, $site, sidebarItems });
  })();
  const next = (()=>{
    return resolvePageLink(LINK_TYPES.NEXT, { $themeConfig, $page, $route, $site, sidebarItems });
  })();

  return prev || next ?
    <div className="page-nav">
      <p className="inner">

        <PageNavEdit data={prev} isPrev={true} className={'prev'}/>

        <PageNavEdit data={next} isPrev={false} className={'next'}/>
      </p>
    </div> : null;
}

function PageNavEdit(props) {
  const { data,isPrev,className } = props;
  if (!data){
    return null;
  }
  const { path,title,type } = data;
  return <span className={className}>
    {isPrev && '← '}

    {type === 'external' ? <a
      href={path}
      target="_blank"
      rel="noopener noreferrer"
    >
      { title || path }
      <OutboundLink />
    </a> : <NavLink to={path}>
      { title || path }
    </NavLink>}

    {!isPrev && ' →'}

  </span>;

}

function resolvePrev (page, items) {
  return find(page, items, -1);
}

function resolveNext (page, items) {
  return find(page, items, 1);
}

const LINK_TYPES = {
  NEXT: {
    resolveLink: resolveNext,
    getThemeLinkConfig: ({ nextLinks }) => nextLinks,
    getPageLinkConfig: ({ frontmatter }) => frontmatter.next
  },
  PREV: {
    resolveLink: resolvePrev,
    getThemeLinkConfig: ({ prevLinks }) => prevLinks,
    getPageLinkConfig: ({ frontmatter }) => frontmatter.prev
  }
};

function resolvePageLink (
  linkType,
  { $themeConfig, $page, $route, $site, sidebarItems }
) {
  const { resolveLink, getThemeLinkConfig, getPageLinkConfig } = linkType;

  // Get link config from theme
  const themeLinkConfig = getThemeLinkConfig($themeConfig);

  // Get link config from current page
  const pageLinkConfig = getPageLinkConfig($page);

  // Page link config will overwrite global theme link config if defined
  const link = isNil(pageLinkConfig) ? themeLinkConfig : pageLinkConfig;

  if (link === false) {
    return;
  } else if (isString(link)) {
    return resolvePage($site.pages, link, $route.path);
  } else {
    return resolveLink($page, sidebarItems);
  }
}

function find (page, items, offset) {
  const res = [];
  flatten(items, res);
  for (let i = 0; i < res.length; i++) {
    const cur = res[i];
    if (cur.type === 'page' && cur.path === decodeURIComponent(page.path)) {
      return res[i + offset];
    }
  }
}

function flatten (items, res) {
  for (let i = 0, l = items.length; i < l; i++) {
    if (items[i].type === 'group') {
      flatten(items[i].children || [], res);
    } else {
      res.push(items[i]);
    }
  }
}