import React from 'react';
import Layout from './Layout';

const isServer = typeof window === 'undefined';
export default ({ routes,siteData }) => {
  const notFoundRoute = routes.find(route => route.path === '\*');
  const NotFoundComp = notFoundRoute.component;

  notFoundRoute.component = function Comp(props) {
    if (isServer) return null;
    return <NotFoundComp {...props}/>;
  };

  routes.unshift({
    name: 'docs',
    path: `${siteData.base}docs/:path`,
    component: Layout
  });
};
