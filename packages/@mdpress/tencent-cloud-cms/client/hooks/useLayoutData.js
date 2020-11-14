import { useState } from 'react';
import useData from '@app/hooks/data';
import store from '@app/store';
import useActiveHeaderLinks from '@internal/hooks/activeHeaderLinks';

export default function useLayoutData(props) {
  const { sidebarItems = [] } = props;
  const { $page = {},$site,$title,$themeLocaleConfig } = useData();
  const { frontmatter = {} } = $page;
  useActiveHeaderLinks();

  const [isSidebarOpen,setIsSidebarOpen] = useState(false);
  const [touchStart,setTouchStart] = useState({ x: 0,y: 0 });
  const { themeConfig } = $site;

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
    pageClasses,
    toggleSidebar
  };
}