import React, { useEffect, useState } from 'react';
import Anchor from 'antd/es/anchor';
import slugify from '@mdpress/shared-utils/lib/slugify';
import { genAnchors } from './util';

import 'antd/es/anchor/style/index.css';
import './anchor.styl';

const AnchorLink = Anchor.Link;

function genAnchorListNode(node) {
  return node.map(item => {
    if (item.children && item.children.length) {
      return <AnchorLink key={item.name} href={`#${slugify(item.name)}`} title={item.name}>
        {genAnchorListNode(item.children)}
      </AnchorLink>;
    }
    return <AnchorLink key={item.name} href={`#${slugify(item.name)}`} title={item.name}/>;
  });
}

export default function AnchorList(props) {
  const { str, container } = props;
  const [list, setList] = useState([]);
  useEffect(() => {
    const el = document.querySelector(container);
    if (str && el) {
      setList(genAnchors(el));
    }
  }, [str]);

  useEffect(() => {
    const el = document.querySelector(container);

    if (list.length && el) {
      el.classList.add('show-anchor');
    } else {
      el.classList.remove('show-anchor');
    }
  },[list]);

  if (!list.length) return null;

  return <div className={'anchor'}><Anchor
    hash={true}
    affix={true}

  >

    {genAnchorListNode(list)}

  </Anchor></div>;
}