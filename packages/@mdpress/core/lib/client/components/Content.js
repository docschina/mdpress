import React from 'react';
import useData from '../hooks/data';
import pages from '@internal/page-components';
import { setGlobalInfo } from '@app/util';
import '../style/content.styl';

export default function Content(props) {
  const { $page } = useData();
  const { pageKey = $page.key,className,slotKey = 'default' } = props;
  setGlobalInfo('pageKey', pageKey);

  const Component = pages[pageKey] || (() => null);
  //
  return <Component className={className} slotKey={slotKey}/>;
}