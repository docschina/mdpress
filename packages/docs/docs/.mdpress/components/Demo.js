import React from 'react';

export default function Demo() {
  const msg = 'Hello this is <Demo>';
  return <p className="demo">
    {msg}
  </p>;
}