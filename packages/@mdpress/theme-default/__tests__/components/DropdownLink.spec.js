import React from 'react';
import { render } from 'enzyme';
import DropdownLink from '../../components/DropdownLink.js';
import { Router } from '@mdpress/test-utils/client';

describe('DropdownLink', () => {
  test('renders dropdown link.', () => {
    const item = {
      text: 'MdPress',
      ariaLabel: 'Learn More Select',
      items: [
        {
          text: 'Guide',
          link: '/guide/'
        },
        {
          text: 'Config Reference',
          link: '/config/'
        }
      ]
    };
    const wrapper = render(
      <Router><DropdownLink item={item}></DropdownLink></Router>,
    );
    expect(wrapper).toMatchSnapshot();
  });

});
