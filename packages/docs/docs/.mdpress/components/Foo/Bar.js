import React from 'react';

export default function Demo() {
  const msg = 'Hello this is <Foo_Bar>';
  return <p className="demo">
    {msg}
  </p>;
}