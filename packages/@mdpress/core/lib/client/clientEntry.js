/* global MDPRESS_VERSION, LAST_COMMIT_HASH*/

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createApp } from './app';

window.__MDPRESS__ = {
  version: MDPRESS_VERSION,
  hash: LAST_COMMIT_HASH
};

createApp(false /* isServer */).then(({ app,routerBase }) => {
  function Client() {
    return  <BrowserRouter basename={routerBase}>
      {app}
    </BrowserRouter>;
  }

  render((
    <Client/>
  ), document.getElementById('root'));
});
