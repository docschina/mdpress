import React from 'react';
import Loadable from './lazy/Loadable';
import loading from '@loading';

export function LazyLoadComponent(loader,key) {
  return Loadable({
    loader,
    loading,
    render(loaded, props) {
      Loadable.loadedMap[key] = true;
      let Component = loaded.default;
      return <Component {...props}/>;
    }
  });
}