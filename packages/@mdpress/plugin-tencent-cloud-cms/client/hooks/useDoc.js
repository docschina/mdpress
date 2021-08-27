import { useState,useEffect } from 'react';
import { getDocData } from '../request';

export default function useDoc(path,staticContext) {
  let initialDoc = { content: '' };

  if (staticContext && staticContext.doc){
    initialDoc = staticContext.doc;
  }
  if (typeof window === 'object' && window.__INITIAL_STATE__) {
    const state = JSON.parse(window.__INITIAL_STATE__);

    if (state.doc && state.param === path) {
      initialDoc = state.doc;
    }
  }

  const [doc,setDoc] = useState(initialDoc);
  const [error,setError] = useState(null);

  useEffect(()=>{
    // console.log('useEffect');
    if (!initialDoc || !initialDoc.id) {
      getDocData(path).then(data => {
        if (data && data.length) {
          setDoc(data[0]);
          setError(null);
        } else {
          setError(new Error('404'));
        }
      }).catch(e => {
        console.error(e);
        setError(e);
      });
    }
  },[path]);

  return { doc,error };
}