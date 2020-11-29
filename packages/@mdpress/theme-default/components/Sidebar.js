import React from 'react';
import SidebarLinks from '@theme/components/SidebarLinks.js';
import NavLinks from '@theme/components/NavLinks.js';

import '../styles/sidebar.styl';

export default function Sidebar(props) {
  const { items = [],top = null,bottom = null } = props;

  return <aside className="sidebar">
    <NavLinks/>

    {top}

    <SidebarLinks
      depth={0}
      items={items}
    />

    {bottom}
  </aside>;
}

