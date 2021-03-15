import React from 'react';
import Loadable from 'react-loadable';

// async component!
const Foo = Loadable({
  loader: () => import('./async-foo'),
  loading: () => null
});

export default context => {
  return new Promise( resolve => {
    context.msg = 'hello';

    Loadable.preloadAll().then(() => {
      const compInstance = React.createElement('div', null, context.url, React.createElement(Foo, null));
      resolve(compInstance);
    });

  });
};
