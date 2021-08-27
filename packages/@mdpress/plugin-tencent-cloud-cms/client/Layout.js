import React from 'react';
import classnames from 'classnames';
import Navbar from '@theme/components/Navbar';
import Sidebar from '@theme/components/Sidebar.js';
import useUpdateMeta from '@app/hooks/updateMeta';
import LayoutComponents from '@internal/layout-components';
import ContentSlotsDistributor from '@app/components/ContentSlotsDistributor';
import AnchorList from './AnchorList';

import useLayoutData from './hooks/useLayoutData';
import useDoc from './hooks/useDoc';
import useSidebar from './hooks/useSidebar';
import useScroll from './hooks/useScroll';
import usePath from './hooks/usePath';

const NotFound = LayoutComponents.NotFound;

export default function GlobalLayout(props) {
  const path = usePath();

  const { doc,error } = useDoc(path || '/',props.staticContext);
  const { data: sidebarItems } = useSidebar(doc._id);
  useUpdateMeta(props);
  useScroll(doc);

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

    <main className="page">
      {error ? <NotFound/> :
        <React.Fragment>
          <AnchorList str={doc.content} container={'.content__default'}/>
          <ContentSlotsDistributor className="theme-default-content" markDownString={doc.content} slotKey={'default'}/>
        </React.Fragment>
      }
    </main>

  </div>;
}
