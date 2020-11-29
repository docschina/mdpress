import React from 'react';
import { StaticRouter } from 'react-router-dom';

import Loadable from 'react-loadable';
import { createApp } from './app';

export default context => new Promise( (resolve, reject) => {

  createApp(true /* isServer */).then(async ({ app,routerBase }) => {
    // console.info('app\n\n',app)
    try {
      await Loadable.preloadAll();
      const pathname = routerBase === '/' ? ('/' + context.url) : context.url;

      resolve(
        <StaticRouter basename={routerBase} location={{ pathname }} context={context}>
          {app}
        </StaticRouter>,
      );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
});
