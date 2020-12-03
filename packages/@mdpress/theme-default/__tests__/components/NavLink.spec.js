import React from 'react';
import { render } from 'enzyme';
import NavLink from '../../components/NavLink';
import { Router } from '@mdpress/test-utils/client';

describe('NavLink', () => {
  test('renders nav link with internal link', () => {
    const item = {
      link: '/',
      text: 'mdpress'
    };

    const wrapper = render(
      <Router><NavLink item={item}></NavLink></Router>,
    );
    expect(wrapper).toMatchSnapshot();
  });

  test('renders nav link with external link', () => {
    const item = {
      link: 'https://react.docschina.org/',
      text: 'React'
    };
    const wrapper = render(
      <Router><NavLink item={item}></NavLink></Router>,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
