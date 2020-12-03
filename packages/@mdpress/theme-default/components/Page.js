import React from 'react';
import Content from '@app/components/Content';
import PageEdit from '@theme/components/PageEdit.js';
import PageNav from '@theme/components/PageNav.js';
import '../styles/page.styl';

export default function Page(props) {
  const { top = null,bottom = null,sidebarItems } = props;
  return <main className="page">
    {top}

    <Content class="theme-default-content"/>
    <PageEdit/>

    <PageNav sidebarItems={sidebarItems}/>

    {bottom}
  </main>;
}
