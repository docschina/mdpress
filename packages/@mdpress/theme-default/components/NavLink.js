import React from 'react';
import useData from '@app/hooks/data';
import { NavLink as Link } from 'react-router-dom';
import { isExternal, isMailto, isTel, ensureExt } from '../util';
import OutboundLink from '@app/components/OutboundLink';

export default function NavLink(props) {
  const { item = {},className,onFocusout } = props;
  const { $site } = useData();

  const link = ensureExt(item.link);

  const exact = function () {
    if ($site.locales) {
      return Object.keys($site.locales).some(rootLink => rootLink === link);
    }
    return link === '/';
  }();

  const isNonHttpURI = isMailto(link) || isTel(link);

  const target = (() => {
    if (isNonHttpURI) {
      return null;
    }
    if (item.target) {
      return item.target;
    }
    return isExternal(link) ? '_blank' : '';
  })();

  const isBlankTarget = target === '_blank';
  const isInternal = (() => {
    return !isExternal(link) && !isBlankTarget;
  })();

  const rel = (() => {
    if (isNonHttpURI) {
      return null;
    }
    if (item.rel) {
      return item.rel;
    }
    return isBlankTarget ? 'noopener noreferrer' : '';
  })();

  const focusoutAction = () => {
    onFocusout && onFocusout();
  };

  return <React.Fragment>
    {isInternal ?
      <Link
        activeClassName={'router-link-active'}
        exact={exact}
        className={'nav-link ' + className ? className : ''}
        to={link}
        onBlur={focusoutAction}
      >
        {item.text}
      </Link> : <a
        href={link}
        className={'nav-link external'}
        target={target}
        rel={rel}
        onBlur={focusoutAction}
      >
        {item.text}
        {isBlankTarget && <OutboundLink/>}
      </a>}

  </React.Fragment>;
}