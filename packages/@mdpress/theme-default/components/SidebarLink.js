import React from 'react';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import useData from '@app/hooks/data';
import OutboundLink from '@app/components/OutboundLink';
import { isActive, hashRE ,groupHeaders } from '../util';
import '../styles/sidebar-link.styl';

export default function SidebarLink(props) {
  const { item,sidebarDepth } = props;
  const {
    $page,
    $route,
    $themeConfig,
    $themeLocaleConfig
  } = useData();
  // use custom active class matching logic
  // due to edge case of paths ending with / + hash
  const selfActive = isActive($route, item.path);
  // for sidebar: auto pages, a hash link should be active if one of its child
  // matches
  const active = item.type === 'auto'
    ? selfActive || item.children.some(c => isActive($route, item.basePath + '#' + c.slug))
    : selfActive;

  const link = item.type === 'external'
    ? renderExternal(null, item.path, item.title || item.path)
    : renderLink(null, item.path, item.title || item.path, active);

  const maxDepth = [
    $page.frontmatter.sidebarDepth,
    sidebarDepth,
    $themeLocaleConfig.sidebarDepth,
    $themeConfig.sidebarDepth,
    1
  ].find(depth => depth !== undefined);

  const displayAllHeaders = $themeLocaleConfig.displayAllHeaders
      || $themeConfig.displayAllHeaders;

  if (item.type === 'auto') {
    return [link, renderChildren(null, item.children, item.basePath, $route, maxDepth)];
  } else if ((active || displayAllHeaders) && item.headers && !hashRE.test(item.path)) {
    const children = groupHeaders(item.headers);
    return [link, renderChildren(null, children, item.path, $route, maxDepth)];
  } else {
    return link;
  }
}


function renderLink (h, to, text, active,level) {
  let style = {};
  if (level > 2) {
    style = {
      'padding-left': level + 'rem'
    };
  }

  return <NavLink
    key="sidebar-link"
    className={classnames({
      active,
      'sidebar-link': true
    })}
    style={style}
    to={to}
    activeClassName={''}
  >
    {text}
  </NavLink>;
}

function renderChildren (h, children, path, route, maxDepth, depth = 1) {
  if (!children || depth > maxDepth) return null;
  return <ul key="sidebar-sub-headers" className='sidebar-sub-headers'>
    {children.map((c,i) => {
      const active = isActive(route, path + '#' + c.slug);
      return <li className='sidebar-sub-header' key={i}>
        {renderLink(h, '#' + c.slug, c.title, active,c.level - 1)}
        {renderChildren(h, c.children, path, route, maxDepth, depth + 1)}
      </li>;
    })}
  </ul>;
}

function renderExternal (h, to, text) {
  return <a href={to} target="_blank" rel="noopener noreferrer" className='sidebar-link'>
    {text}
    <OutboundLink/>
  </a>;
}