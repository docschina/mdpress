import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import classnames from 'classnames';
import last from 'lodash/last';
import NavLink from './NavLink';
import DropdownTransition from './DropdownTransition';
import '../styles/dropdown-link.styl';

export default function DropdownLink(props) {
  const [open, setOpen] = useState(false);
  const { item } = props;
  const location = useLocation();

  const dropdownAriaLabel = item.ariaLabel || item.text;
  const toggle = () => setOpen(!open);

  const isLastItemOfArray = (item, array) => {
    return last(array) === item;
  };

  const handleDropdown = (event) => {
    const isTriggerByTab = event.detail === 0;
    if (isTriggerByTab) setOpen(!open);
  };

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return <div className={classnames('dropdown-wrapper', { open })}>
    <button
      type="button"
      className="dropdown-title"
      aria-label={dropdownAriaLabel}
      onClick={handleDropdown}>
      <span className="title">{item.text}</span>
      <span className="arrow down"></span>
    </button>
    <button
      type="button"
      className="mobile-dropdown-title"
      aria-label={dropdownAriaLabel}
      onClick={toggle}>
      <span className="title">{item.text}</span>
      <span className={classnames('arrow', open ? 'down' : 'right')}></span>
    </button>

    <DropdownTransition>
      <ul className="nav-dropdown">
        {item.items.map((subItem, index) => {
          return <li className="dropdown-item" key={subItem.link || index}>
            {subItem.type === 'links' && <h4>{subItem.text}</h4>}

            {subItem.type === 'links' ? <ul className="dropdown-subitem-wrapper">
              {subItem.items.map(childSubItem => {
                return <li className="dropdown-subitem" key={childSubItem.link}>
                  <NavLink item={childSubItem} onFocusout={() => {
                    isLastItemOfArray(childSubItem, subItem.items) &&
                    isLastItemOfArray(subItem, item.items) &&
                    setOpen(false);
                  }}/>
                </li>;
              })}
            </ul> : <NavLink item={subItem} onFocusout={() => {
              isLastItemOfArray(subItem, item.items) && setOpen(false);
            }}/>}

          </li>;
        })}

      </ul>
    </DropdownTransition>
  </div>;
}