import React from 'react';
import classnames from 'classnames';
import './style.styl';

export default function Badge(props){
  const { type = 'tip',text,vertica = 'top' } = props;

  return <span
    className={classnames('badge', type)}
    style={{ verticalAlign: vertica }}
  >
    {text || props.children }
  </span>;
}