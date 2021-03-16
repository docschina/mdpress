import React from 'react';
import Loadable from 'react-loadable';

// async component!
const Foo = Loadable({
  loader: () => import('./async-foo'),
  loading: () => null
});

const Bar = Loadable({ // eslint-disable-line
  loader: () => import('./async-bar'),
  loading: () => null
});

export default context => {
  return new Promise( resolve => {
    context.msg = 'hello';

    Loadable.preloadAll().then(() => {
      const compInstance = React.createElement('div', null, context.url, React.createElement(Foo, context));
      resolve(compInstance);
    });

  });
};
