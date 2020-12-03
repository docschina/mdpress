import React, { useState, useEffect } from 'react';

const DefaultOnSSR = () => (<span></span>);
export default function ClientOnly(props) {
  const [canRender, setCanRender] = useState(false);
  const { children, onSSR = <DefaultOnSSR/> } = props;

  useEffect(() => {
    setCanRender(true);
  }, []);
  return canRender ? children : onSSR;
}