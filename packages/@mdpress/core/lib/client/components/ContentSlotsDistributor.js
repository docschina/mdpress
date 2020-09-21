import React,{ useEffect,useRef,useState,useMemo } from 'react';
import PropTypes from 'prop-types';
import { SupportReactComponent } from 'markdown-it-react-component/dist';
import useData from '@app/hooks/data';
import sandbox from '@internal/sandbox';
import { useComponentWillMount } from '@app/hooks/lifecycle';
import ClientOnly from '@app/components/ClientOnly';
import Content from '@app/components/Content';
import OutboundLink from '@app/components/OutboundLink';
import mdpress from '@app/store';
import { getEnv } from '@app/util';

const isServer = getEnv() === 'server';
const md = mdpress.createMD();

function initSandbox(md,sandbox = {},options = {}) {
  // console.info('initSandbox',sandbox);
  md.use(md => SupportReactComponent(md, {
    allowErrorLog: true,
    sandbox: {
      ...sandbox,
      ...options
    },
    babelInit: (babel) => {
      if (babel.availablePlugins.filterXSS) {
        babel.availablePlugins.filterXSS = () => {
          return {};
        };
      }
    }
  }));
}

function ContentSlotsDistributor(props) {
  const { md,markDownString,className,slotKey } = props;
  const { $site,$page } = useData();
  const [slot,setSlot] = useState(null);
  const slotRef = useRef(null);

  useEffect(()=>{
    setSlot(document.getElementById(slotKey));
  },[]);

  useEffect(()=>{
    if (slotKey !== 'default' && slotRef && slot){
      Array.from(slot.childNodes).forEach((child,index) => {
        const oldChidren = slotRef.current.childNodes[index];
        if (oldChidren){
          slotRef.current.replaceChild(child,oldChidren);
        } else {
          slotRef.current.appendChild(child);
        }
      });
      slot.parentNode.removeChild(slot);
    }
  },[slot]);

  if (slotKey !== 'default'){
    return <div ref={slotRef}></div>;
  }

  useComponentWillMount(() => {
    // console.log('ContentSlotsDistributor will mount');
    initSandbox(md,sandbox,{
      $site,$page,
      JSON,ClientOnly,console,
      Content,OutboundLink,
      $withBase: function (path) {
        const base = $site.base;
        if (path.charAt(0) === '/') {
          return base + path.slice(1);
        } else {
          return path;
        }
      }
    });
  });

  // Info: https://github.com/facebook/react/issues/16416
  if (isServer){
    return <Preview html={md.render(markDownString)} slotKey={slotKey} className={className}/>;
  }

  return useMemo(() => {
    const html = md.render(markDownString);
    return <Preview html={html} slotKey={slotKey} className={className}/>;
  },[markDownString,slotKey,className]);
}

function Preview(props){
  const { html,slotKey,className } = props;
  return <div className={'content ' + `content__${slotKey} ` + className}
    dangerouslySetInnerHTML={{ __html: html }}>

  </div>;
}

ContentSlotsDistributor.propTypes = {
  markDownString: PropTypes.string,
  className: PropTypes.string,
  scrollAnchor: PropTypes.bool,
  mdInit: PropTypes.func,
  md: PropTypes.object
};
ContentSlotsDistributor.defaultProps = {
  markDownString: '',
  className: '',
  scrollAnchor: true,
  mdInit: () => {},
  md
};
export default ContentSlotsDistributor;
