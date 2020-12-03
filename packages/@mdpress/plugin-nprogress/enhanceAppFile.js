import nprogress from 'nprogress';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { loadedMap } from '@app/lazy/Loadable';
import './nprogress.styl';

function useNProgress() {
  const location = useLocation();
  useEffect(()=>{
    nprogress.configure({ showSpinner: false });
  },[]);

  useEffect(()=>{
    nprogress.done();
    loadedMap[location.pathname] = true;
  },[location.pathname]);
}
export default ({ hooks }) => {
  hooks.push(useNProgress);
};
