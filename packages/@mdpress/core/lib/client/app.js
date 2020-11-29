/* global MDPRESS_TEMP_PATH */
import React,{ useEffect } from 'react';
import { Switch,Redirect,Route } from 'react-router-dom';
import { ScrollContext } from 'react-router-scroll-4';
import store from '@app/store';
import { siteData } from '@internal/siteData';
import appEnhancers from '@internal/app-enhancers';
import globalUIComponents from '@internal/global-ui';
import { routes } from '@internal/routes';
import { handleRedirectForCleanUrls } from './redirect.js';
import sandbox from '@internal/sandbox';
import mdpress from './store';
import { getElementPosition, normalizeOffset,getEnv } from './util';

const isServer = getEnv() === 'server';
const mdConfig = mdpress.mdConfig;
// suggest dev server restart on base change
if (module.hot) {
  const prevBase = siteData.base;
  module.hot.accept(MDPRESS_TEMP_PATH + '/internal/siteData.js', () => {
    if (siteData.base !== prevBase) {
      window.alert(
        '[mdpress] Site base has changed. '
                + 'Please restart dev server to ensure correct asset paths.'
      );
    }
  });
}

const shouldUpdateScroll = (prevRouterProps, { location }) => {
  if (location.hash) {
    if (store.$get('disableScrollBehavior')) {
      return false;
    }

    const dom = document.querySelector(`${decodeURIComponent(location.hash)}`);
    if (dom){
      const position = getElementPosition(dom,normalizeOffset(dom));
      window.scrollTo(position.x, position.y);
    }
  } else {
    return [0,0];
  }
};

function App(props) {
  const { shouldUpdateScroll } = props;
  useEffect(() => {
    setTimeout(()=>{
      shouldUpdateScroll && shouldUpdateScroll(null, { location: window.location });
    },1000);
  },[]);

  const { routes,hooks } = props;

  hooks.forEach(hook => {
    typeof hook === 'function' && hook();
  });
  handleRedirectForCleanUrls(routes);

  const children = <React.Fragment>
    <Switch>
      {routes.map(route =>
        route.redirect ? <Redirect key={route.path} strict={false} exact from={route.path} to={route.redirect}/> : <Route exact strict={false} path={route.path} key={route.path} component={route.component} render={route.render}/>
      )}
    </Switch>
    {globalUIComponents.map((name,index) => {
      const Comp = sandbox[name] || (() => null);
      return <Comp key={index}/>;
    })}
  </React.Fragment>;


  return isServer ? children : <ScrollContext shouldUpdateScroll={shouldUpdateScroll}>
    {children}
  </ScrollContext>;
}

export async function createApp (isServer) {
  const routerBase = typeof window !== 'undefined' && window.__MDPRESS_ROUTER_BASE__
    ? window.__MDPRESS_ROUTER_BASE__
    : (siteData.routerBase || siteData.base);

  let hooks = [];
  routes.shouldUpdateScroll = shouldUpdateScroll;
  try {
    await Promise.all(
      appEnhancers
        .filter(enhancer => typeof enhancer === 'function')
        .map(enhancer => enhancer({ sandbox, routes, siteData, isServer,mdConfig,hooks }))
    );
  } catch (e) {
    console.error(e);
  }

  return {
    app: <App
      routes={routes}
      siteData={siteData}
      hooks={hooks}
      shouldUpdateScroll={routes.shouldUpdateScroll}
    />,
    routerBase
  };
}
