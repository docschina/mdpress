/* global AHL_SIDEBAR_LINK_SELECTOR, AHL_HEADER_ANCHOR_SELECTOR */

import debounce from 'lodash.debounce';
import { useEffect } from 'react';
import store from '@app/store';
import {
  useLocation,
  useHistory
} from 'react-router-dom';

export default function useActiveHeaderLinks() {
  const history = useHistory();
  const { hash } = useLocation();

  const setActiveHash = () => {
    const sidebarLinks = [].slice.call(document.querySelectorAll(AHL_SIDEBAR_LINK_SELECTOR));
    const anchors = [].slice.call(document.querySelectorAll(AHL_HEADER_ANCHOR_SELECTOR))
      .filter(anchor => sidebarLinks.some(sidebarLink => sidebarLink.hash === anchor.hash));

    const scrollTop = Math.max(
      window.pageYOffset,
      document.documentElement.scrollTop,
      document.body.scrollTop
    );

    const scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );

    const bottomY = window.innerHeight + scrollTop;

    for (let i = 0; i < anchors.length; i++) {
      const anchor = anchors[i];
      const nextAnchor = anchors[i + 1];

      const isActive = i === 0 && scrollTop === 0 ||
                (scrollTop >= anchor.parentElement.offsetTop + 10 &&
                    (!nextAnchor || scrollTop < nextAnchor.parentElement.offsetTop - 10));

      const routeHash = decodeURIComponent(hash);
      if (isActive && routeHash !== decodeURIComponent(anchor.hash)) {
        const activeAnchor = anchor;
        // check if anchor is at the bottom of the page to keep $route.hash consistent
        if (bottomY === scrollHeight) {
          for (let j = i + 1; j < anchors.length; j++) {
            if (routeHash === decodeURIComponent(anchors[j].hash)) {
              return;
            }
          }
        }
        store.$set('disableScrollBehavior',true);

        // console.info('true')
        history.replace(decodeURIComponent(activeAnchor.hash));
        setTimeout(()=>{
          // execute after scrollBehavior handler.
          store.$set('disableScrollBehavior',false);
        },100);
        return;
      }
    }
  };
  const onScroll = debounce(function () {
    setActiveHash();
  }, 300);
  useEffect(()=>{
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  },[hash]);

  return {
    onScroll
  };
}