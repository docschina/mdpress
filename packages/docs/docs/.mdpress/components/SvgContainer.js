import React from 'react';
import './style/svg-container.styl';

export default function SvgContainer(props) {
  return <div className="svg-container">
    {props.children}
  </div>;
}