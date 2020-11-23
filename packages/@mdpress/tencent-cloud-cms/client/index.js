import React from 'react';
import Layout from './Layout';

const isServer = typeof window === 'undefined';
export default ({ routes }) => {
  const notFoundRoute = routes.find(route => route.path === '\*');
  const NotFoundComp = notFoundRoute.component;

  notFoundRoute.component = function Comp(props) {
    if (isServer) return null;
    return <NotFoundComp {...props}/>;
  };

  routes.unshift({
    name: 'docs',
    path: '/docs/',
    component: Layout
  });
  routes.unshift({
    name: 'docs',
    path: '/docs/:path',
    component: Layout
  });
};
