import React from 'react';
import { Transition } from 'react-transition-group';
import '../styles/dropdown-transition.styl';

export default function DropdownTransition(props) {
  const setHeight = (items) => {
    // explicitly set height so that it can be transitioned
    items.style.height = items.scrollHeight + 'px';
  };

  const unsetHeight = (items) => {
    items.style.height = '';
  };

  return <Transition
    timeout={{
      appear: 500,
      enter: 300,
      exit: 500,
    }}
    name="dropdown"
    onEntering={setHeight}
    onEntered={unsetHeight}
    onExit={setHeight}
  >
    <React.Fragment>
      {props.children}
    </React.Fragment>
  </Transition>;
}