import { useState,useEffect } from 'react';
import { getDocData } from '../request';

export default function useDoc(path) {
  let initialDoc = { content: '' };

  const [doc,setDoc] = useState(initialDoc);
  const [error,setError] = useState(null);

  useEffect(()=>{
    // console.log('useEffect');
    if (!initialDoc || !initialDoc.id) {
      getDocData(path).then(data => {
        if (data && data.length) {
          setDoc(data[0]);
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