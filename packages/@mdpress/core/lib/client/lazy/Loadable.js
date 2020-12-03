import Loadable from 'react-loadable';

export const preloadAll = Loadable.preloadAll;
Loadable.loadedMap = {};
export const loadedMap = Loadable.loadedMap;

// preloadAll().then(() =>{
//   console.log('preloadAll');
// })

export default Loadable;