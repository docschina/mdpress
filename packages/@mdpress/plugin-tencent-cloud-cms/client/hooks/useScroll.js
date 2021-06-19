import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { getElementPosition,normalizeOffset } from '@app/util';
import store from '@app/store';

const shouldUpdateScroll = (location) => {
  if (location.hash) {
    if (store.$get('disableScrollBehavior')) {
      return false;
    }

    const dom = document.querySelector(`${decodeURIComponent(location.hash)}`);
    if (dom) {
      const position = getElementPosition(dom, normalizeOffset(dom));
      window.scrollTo(position.x, position.y);
    }
  } else {
    return [0, 0];
  }
};

export default function useScroll(doc) {
  const location = useLocation();

  useEffect(() => {
    if (doc && doc.content) {
      shouldUpdateScroll(location);
    }
  }, [location, doc]);

  return;
}