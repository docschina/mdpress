import React from 'react';
import { useLocation } from 'react-router-dom';
import nprogress from 'nprogress';
import { loadedMap } from '@app/lazy/Loadable';

function getEnv() {
  return typeof window === 'undefined' ? 'server' : 'browser';
}

const isServer = getEnv() === 'server';
export default function Loading(props) {
  try {
    const { pathname } = useLocation();
    if (props.isLoading && !loadedMap[pathname] && !isServer) {
      // Todo: only page
      nprogress.start();
      return <div>isLoading</div>;
    }
  } catch (e) {
    return null;
  }

  if (props.error) {
    return <div>Error! <button onClick={ props.retry }>Retry</button></div>;
  } else if (props.timedOut) {
    return <div>Taking a long time... <button onClick={ props.retry }>Retry</button></div>;
  } else if (props.pastDelay) {
    return <div>Loading...</div>;
  } else {
    return null;
  }
}