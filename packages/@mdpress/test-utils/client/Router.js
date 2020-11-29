import React from 'react';
import { MemoryRouter,Route } from 'react-router-dom';

export default function Router (props) {
  return <MemoryRouter initialEntries={['/']}>
    <Route path="/">
      {props.children}
    </Route>
  </MemoryRouter>;
}