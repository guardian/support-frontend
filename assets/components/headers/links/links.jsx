// @flow
import React from 'react';

import { routes } from 'helpers/routes';
import { getPatronsLink } from 'helpers/externalLinks';
import { type Option } from 'helpers/types/option';
import { classNameWithModifiers } from 'helpers/utilities';
import { clickedEvent } from 'helpers/tracking/clickTracking';


// types
type HeaderNavLink = {
  href: string,
  text: string,
  trackAs: string,
}

type PropTypes = {|
  baseClassName: string,
  location: 'desktop' | 'mobile',
  getRef: Option<(?Element) => void>
|};


const links: HeaderNavLink[] = [
  {
    href: routes.showcase,
    text: 'Support',
    trackAs: 'showcase',
  },
  {
    href: routes.subscriptionsLanding,
    text: 'Subscriptions',
    trackAs: 'subscriptions',
  },
  {
    href: routes.digitalSubscriptionLanding,
    text: 'Digital',
    trackAs: 'subscriptions:digital',
  },
  {
    href: routes.paperSubscriptionLanding,
    text: 'Paper',
    trackAs: 'subscriptions:paper',
  },
  {
    href: routes.guardianWeeklySubscriptionLanding,
    text: 'Guardian Weekly',
    trackAs: 'subscriptions:guardianweekly',
  },
  {
    href: getPatronsLink(),
    text: 'Patrons',
    trackAs: 'patrons',
  },
];


// Export
const Links = ({ baseClassName, location, getRef }: PropTypes) => (
  <nav className={baseClassName}>
    <ul className={[baseClassName, 'ul'].join('__')} ref={getRef}>
      {links.map(({ href, text, trackAs }) => (
        <li
          className={
          classNameWithModifiers(
            [baseClassName, 'li'].join('__'),
            [window.location.href.endsWith(href) ? 'active' : null],
          )
        }
        >
          <a
            onClick={() => { clickedEvent(['header-link', trackAs, location].join(' - ')); }}
            className={[baseClassName, 'link'].join('__')}
            href={href}
          >
            {text}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

Links.defaultProps = {
  getRef: null,
};
export default Links;
