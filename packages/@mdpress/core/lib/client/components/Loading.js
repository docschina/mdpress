import React from 'react';
import { useLocation } from 'react-router-dom';
import { loadedMap } from '../lazy/Loadable';

export default function Loading(props) {
  const { pathname } = useLocation();
  if (props.isLoading && !loadedMap[pathname]) {
    return <div>isLoading</div>;
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