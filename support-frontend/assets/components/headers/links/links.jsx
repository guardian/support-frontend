// @flow
import React from 'react';

import { routes } from 'helpers/routes';
import { getPatronsLink } from 'helpers/externalLinks';
import { type Option } from 'helpers/types/option';
import { classNameWithModifiers } from 'helpers/utilities';
import { clickedEvent } from 'helpers/tracking/clickTracking';
import { type CountryGroupId, GBPCountries } from 'helpers/internationalisation/countryGroup';

// types
type HeaderNavLink = {
  href: string,
  text: string,
  trackAs: string,
  opensInNewWindow?: boolean,
  include?: CountryGroupId[],
}

type PropTypes = {|
  location: 'desktop' | 'mobile',
  countryGroupId: ?CountryGroupId,
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
    include: [GBPCountries],
  },
  {
    href: routes.guardianWeeklySubscriptionLanding,
    text: 'Guardian Weekly',
    trackAs: 'subscriptions:guardianweekly',
  },
  {
    href: getPatronsLink('support-header'),
    text: 'Patrons',
    trackAs: 'patrons',
    opensInNewWindow: true,
  },
];


// Export
const Links = ({ location, getRef, countryGroupId }: PropTypes) => (
  <nav className={classNameWithModifiers('component-header-links', [location])}>
    <ul className="component-header-links__ul" ref={getRef}>
      {links.filter(({ include }) => {
        if (!countryGroupId) {
          return true;
        }
        if (include && !include.includes(countryGroupId)) {
          return false;
        }
        return true;
      }).map(({
        href, text, trackAs, opensInNewWindow,
        }) => (
          <li
            className={
              classNameWithModifiers(
                'component-header-links__li',
                [window.location.href.endsWith(href) ? 'active' : null],
              )
            }
          >
            <a
              onClick={() => { clickedEvent(['header-link', trackAs, location].join(' - ')); }}
              className="component-header-links__link"
              href={href}
              target={opensInNewWindow ? '_blank' : null}
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
