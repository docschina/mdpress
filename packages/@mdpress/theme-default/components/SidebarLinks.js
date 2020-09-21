import React,{ useState,useEffect } from 'react';
import useData from '@app/hooks/data';
import SidebarGroup from '@theme/components/SidebarGroup.js';
import SidebarLink from '@theme/components/SidebarLink.js';
import { isActive as isActiveUtil } from '../util';

export default function SidebarLinks(props) {
  const [openGroupIndex,setOpenGroupIndex] = useState(0);
  const { items = [],depth,sidebarDepth,className = '' } = props;
  let { $route }  = useData();

  const refreshIndex = ()  => {
    const index = resolveOpenGroupIndex(
      $route,
      items
    );
    if (index > -1) {
      setOpenGroupIndex(index);
    }
  };
  const toggleGroup = (index) => {
    setOpenGroupIndex(index === openGroupIndex ? -1 : index);
  };

  // Todo:created refreshIndex()

  useEffect(()=>{
    refreshIndex();
  },[$route]);

  return items.length ?  <ul className={'sidebar-links ' + className}>
    {items.map((item,i)=>{
      return <li key={i}>
        {item.type === 'group' ? <SidebarGroup
          item={item}
          open={i === openGroupIndex}
          collapsable={item.collapsable || item.collapsible}
          depth={depth}
          toggle={() => toggleGroup(i)}
        /> : <SidebarLink sidebarDepth={sidebarDepth} item={item}/> }
      </li>;
    })}
  </ul> : null;
}

function resolveOpenGroupIndex (route, items) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (descendantIsActive(route, item)) {
      return i;
    }
  }
  return -1;
}

function descendantIsActive (route, item) {
  if (item.type === 'group') {
    return item.children.some(child => {
      if (child.type === 'group') {
        return descendantIsActive(route, child);
      } else {
        return child.type === 'page' && isActiveUtil(route, child.path);
      }
    });
  }
  return false;
}