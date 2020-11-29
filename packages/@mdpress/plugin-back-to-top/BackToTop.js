import React, { useState, useEffect } from 'react';
import { Transition } from 'react-transition-group';
import debounce from 'lodash.debounce';
import './style.styl';

export default function BackToTop(props) {
  const { threshold = 300 } = props;
  const [scrollTop, setScrollTop] = useState(null);
  const show = scrollTop > threshold;

  const getScrollTop = () => window.pageYOffset
        || document.documentElement.scrollTop
        || document.body.scrollTop || 0;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setScrollTop(0);
  };
  useEffect(() => {
    setScrollTop(getScrollTop());
    const onScroll = debounce(() => {
      setScrollTop(getScrollTop());
    });
    window.addEventListener('scroll', onScroll, 100);
    return () => {
      window.removeEventListener('scroll', onScroll, 100);
    };
  }, []);
  return <Transition name="fade"
    timeout={{
      appear: 500,
      enter: 300,
      exit: 500,
    }}>
    <React.Fragment>
      {show &&
        <svg
          className="go-to-top"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 49.484 28.284"
          onClick={scrollToTop}
        >
          <g transform="translate(-229 -126.358)">
            <rect
              fill="currentColor"
              width="35"
              height="5"
              rx="2"
              transform="translate(229 151.107) rotate(-45)"
            />
            <rect
              fill="currentColor"
              width="35"
              height="5"
              rx="2"
              transform="translate(274.949 154.642) rotate(-135)"
            />
          </g>
        </svg>
      }
    </React.Fragment>
  </Transition>;
}