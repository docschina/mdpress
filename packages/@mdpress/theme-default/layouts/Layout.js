import React, { useEffect,useState } from 'react';
import classnames from 'classnames';
import Home from '@theme/components/Home.js';
import Navbar from '@theme/components/Navbar.js';
import Sidebar from '@theme/components/Sidebar.js';
import Page from '@theme/components/Page.js';
import useData from '@app/hooks/data';
import useUpdateMeta from '@app/hooks/updateMeta';
import { loadedMap } from '@app/lazy/Loadable';
import store from '@app/store';
import useActiveHeaderLinks from '@internal/hooks/activeHeaderLinks';
import { resolveSidebarItems } from '../util';
import '../styles/index.styl';

export function useLayoutData() {
  const { $page = {},$site,$route,$localePath,$title,$themeLocaleConfig } = useData();
  const { frontmatter = {} } = $page;
  useActiveHeaderLinks();

  const [isSidebarOpen,setIsSidebarOpen] = useState(false);
  const [touchStart,setTouchStart] = useState({ x: 0,y: 0 });
  const { themeConfig } = $site;

  const sidebarItems = resolveSidebarItems(
    $page,
    $page.regularPath,
    $site,
    $localePath
  );

  const shouldShowNavbar = (() => {
    if (
      frontmatter.navbar === false ||
        themeConfig.navbar === false) {
      return false;
    }
    return (
      $title ||
        themeConfig.logo ||
        themeConfig.repo ||
        themeConfig.nav ||
        $themeLocaleConfig.nav
    );
  })();

  const shouldShowSidebar =  (()=> {
    const { frontmatter } = $page;
    return (
      !frontmatter.home &&
        frontmatter.sidebar !== false &&
        sidebarItems.length
    );
  })();

  const pageClasses = (() => {
    const userPageClass = $page.frontmatter.pageClass;
    return [
      {
        'no-navbar': !shouldShowNavbar,
        'sidebar-open': isSidebarOpen,
        'no-sidebar': !shouldShowSidebar
      },
      userPageClass
    ];
  })();

  const toggleSidebar = (to) => {
    const value = typeof to === 'boolean' ? to : !isSidebarOpen;
    setIsSidebarOpen(value);
    store.$emit('toggle-sidebar', value);
  };

  const onTouchStart = (e) => {
    setTouchStart({
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    });
  };

  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStart.x;
    const dy = e.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx > 0 && touchStart.x <= 80) {
        toggleSidebar(true);
      } else {
        toggleSidebar(false);
      }
    }
  };

  return {
    onTouchStart,
    onTouchEnd,
    shouldShowNavbar,
    shouldShowSidebar,
    isSidebarOpen,setIsSidebarOpen,
    toggleSidebar,
    frontmatter,
    sidebarItems,
    pageClasses,
    $route,
  };
}

function Layout(props = {}) {

  useUpdateMeta(props);

  const {
    $route,
    pageClasses,
    frontmatter,
    sidebarItems,
    setIsSidebarOpen,
    shouldShowNavbar,
    toggleSidebar,
    onTouchStart,onTouchEnd
  } = useLayoutData(props);

  const { className = '',id = '' } = props;

  useEffect(()=>{
    console.info('mounted Layout',props);
  },[]);

  useEffect(()=>{
    setIsSidebarOpen(false);
    loadedMap[$route.path] = true;
  },[$route.path]);

  return <div
    id={id}
    className={classnames('theme-container',pageClasses,className)}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
  >
    {shouldShowNavbar && <Navbar toggleSidebar={toggleSidebar}/>}

    <div className={'sidebar-mask'} onClick={() => toggleSidebar(false)}></div>

    <Sidebar items={sidebarItems} toggleSidebar={toggleSidebar}>

    </Sidebar>

    {frontmatter.home ? <Home/> : <Page sidebarItems={sidebarItems}></Page>}

  </div>;
}

export default Layout;