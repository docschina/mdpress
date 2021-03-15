import React from 'react';

export default context => {
  return new Promise(resolve => {
    context.msg = 'hello';
    resolve(React.createElement('div', null, context.url));
  });
};
