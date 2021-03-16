import React from 'react';
import './test.css';
import font from './test.woff2';
import image from './test.png';

export default function Foo(props) {
  if (props._registeredComponents) {
    props._registeredComponents.add('__MODULE_ID__');
  }
  return React.createElement('div', null, `async ${font} ${image}`);
}