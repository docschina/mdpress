import React from 'react';
import classnames from 'classnames';
import { useParams } from 'react-router-dom';
import Navbar from '@theme/components/Navbar';
import Sidebar from '@theme/components/Sidebar.js';
import useUpdateMeta from '@app/hooks/updateMeta';
import LayoutComponents from '@internal/layout-components';
import ContentSlotsDistributor from '@app/components/ContentSlotsDistributor';
import AnchorList from './AnchorList';

import useLayoutData from './hooks/useLayoutData';
import useDoc from './hooks/useDoc';
import useSidebar from './hooks/useSidebar';

const NotFound = LayoutComponents.NotFound;

export default function GlobalLayout(props) {
  const params = useParams();
  const { doc,error } = useDoc(params.path || '/',props.staticContext);
  const { data: sidebarItems } = useSidebar(doc._id);
  useUpdateMeta(props);

  // console.log('doc',doc);
  // console.log('sidebarItems',sidebarItems);
  const {
    shouldShowNavbar,
    pageClasses,
    onTouchStart,onTouchEnd,
    toggleSidebar
  } = useLayoutData({
    ...props,
    sidebarItems
  });

  return <div
    className={classnames('theme-container',pageClasses)}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
  >
    {shouldShowNavbar && <Navbar toggleSidebar={toggleSidebar}/>}

    <div className={'sidebar-mask'} onClick={() => toggleSidebar(false)}></div>

    <Sidebar items={sidebarItems} toggleSidebar={toggleSidebar}/>

    {error ? <NotFound/> :
      <main className="page">
        <AnchorList str={doc.content} container={'.content__default'}/>
        <ContentSlotsDistributor className="theme-default-content" markDownString={doc.content} slotKey={'default'}/>
      </main>
    }
  </div>;
}
