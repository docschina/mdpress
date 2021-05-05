/* global MDPRESS_VERSION, LAST_COMMIT_HASH*/

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createApp } from './app';

window.__MDPRESS__ = {
  version: MDPRESS_VERSION,
  hash: LAST_COMMIT_HASH
};

if (!window.MDPRESS_INIT) {
  createApp(false /* isServer */).then(({ app,routerBase }) => {
    function Client() {
      return  <BrowserRouter basename={routerBase}>
        {app}
      </BrowserRouter>;
    }

    window.MDPRESS_INIT = true;
    render((
      <Client/>
    ), document.getElementById('root'));
  });
}
