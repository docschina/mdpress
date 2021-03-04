import { useState, useEffect } from 'react';
import { getSidebarData } from '../request';

export default function useSidebar(param) {

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (param) {
      getSidebarData(param).then(data => {
        if (data && data.length) {
          setData(data);
        }
      }).catch(e => {
        console.error(e);
        setError(e);
      });
    }
  }, [param]);

  return { data, error };
}