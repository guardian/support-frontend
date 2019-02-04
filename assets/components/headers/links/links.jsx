// @flow
import React from 'react';

import { routes } from 'helpers/routes';
import { getPatronsLink } from 'helpers/externalLinks';
import { type Option } from 'helpers/types/option';
import { classNameWithModifiers } from 'helpers/utilities';

// types
type HeaderNavLink = {
  href: string,
  text: string
}

type PropTypes = {|
  baseClassName: string,
  getRef: Option<(?Element) => void>
|};


const links: HeaderNavLink[] = [
  {
    href: routes.showcase,
    text: 'Support',
  },
  {
    href: routes.subscriptionsLanding,
    text: 'Subscriptions',
  },
  {
    href: routes.digitalSubscriptionLanding,
    text: 'Digital',
  },
  {
    href: routes.paperSubscriptionLanding,
    text: 'Paper',
  },
  {
    href: routes.guardianWeeklySubscriptionLanding,
    text: 'Guardian Weekly',
  },
  {
    href: getPatronsLink(),
    text: 'Patrons',
  },
];


// Export
const Links = ({ baseClassName, getRef }: PropTypes) => (
  <nav className={baseClassName}>
    <ul className={[baseClassName, 'ul'].join('__')} ref={getRef}>
      {links.map(({ href, text }) => (
        <li
          className={
          classNameWithModifiers(
            [baseClassName, 'li'].join('__'),
            [window.location.href.endsWith(href) ? 'active' : null],
          )
        }
        >
          <a className={[baseClassName, 'link'].join('__')} href={href}>{text}</a>
        </li>
))}
    </ul>
  </nav>

);

Links.defaultProps = {
  getRef: null,
};
export default Links;
