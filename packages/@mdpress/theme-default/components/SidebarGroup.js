import React from 'react';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';
import useData from '@app/hooks/data';
import DropdownTransition from './DropdownTransition';
import SidebarLinks from '@theme/components/SidebarLinks.js';
import { isActive } from '../util';

import '../styles/sidebar-group.styl';

export default function SidebarGroup(props) {
  const { item, depth, open, collapsable, toggle } = props;
  const {
    $route,
  } = useData();
  return <section className={classnames('sidebar-group', { 'is-sub-group': depth !== 0, collapsable },`depth-${depth}`)}>
    {item.path ? <NavLink
      className={classnames('sidebar-heading','clickable', {
        open,
        'active': isActive($route, item.path)
      })}
      onClick={toggle}>
      <span>{item.title}</span>
      {collapsable && <span className={classnames('arrow', open ? 'down' : 'right')}></span>}
    </NavLink> :     <p
      className={classnames('sidebar-heading', {
        open
      })}
      onClick={toggle}>
      <span>{item.title}</span>
      {collapsable && <span className={classnames('arrow', open ? 'down' : 'right')}></span>}
    </p>
    }

    <DropdownTransition>
      {/*{(open || !collapsable) &&  <ul className="sidebar-group-items">*/}
      {/*{item.children.map((child,i) => {*/}
      {/*return <li key={i}><SidebarLink item={child}/></li>;*/}
      {/*})}*/}
      {/*</ul>}*/}
      {(open || !collapsable) &&  <SidebarLinks
        className="sidebar-group-items"
        items={item.children}
        sidebarDepth={item.sidebarDepth}
        depth={depth + 1}
      />}
    </DropdownTransition>
  </section>;
}