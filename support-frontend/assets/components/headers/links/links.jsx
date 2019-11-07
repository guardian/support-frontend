// @flow
import React from 'react';
import cx from 'classnames';

import { routes } from 'helpers/routes';
import { getPatronsLink } from 'helpers/externalLinks';
import { type Option } from 'helpers/types/option';
import { classNameWithModifiers } from 'helpers/utilities';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import {
  type CountryGroupId, GBPCountries,
} from 'helpers/internationalisation/countryGroup';
import { countryGroups } from 'helpers/internationalisation/countryGroup';

// types
type HeaderNavLink = {
  href: string,
  text: string,
  trackAs: string,
  internal: boolean,
  opensInNewWindow?: boolean,
  include?: CountryGroupId[],
  additionalClasses?: string,
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
    internal: true,
  },
  {
    href: routes.recurringContribCheckout,
    text: 'Contributions',
    trackAs: 'contributions',
    additionalClasses: 'component-header-links__li--show-on-tablet',
    internal: true,
  },
  {
    href: routes.subscriptionsLanding,
    text: 'Subscriptions',
    trackAs: 'subscriptions',
    internal: true,
  },
  {
    href: routes.digitalSubscriptionLanding,
    text: 'Digital',
    trackAs: 'subscriptions:digital',
    internal: true,
  },
  {
    href: routes.paperSubscriptionLanding,
    text: 'Paper',
    trackAs: 'subscriptions:paper',
    include: [GBPCountries],
    internal: true,
  },
  {
    href: routes.guardianWeeklySubscriptionLanding,
    text: 'Guardian Weekly',
    trackAs: 'subscriptions:guardianweekly',
    internal: true,
  },
  {
    href: getPatronsLink('support-header'),
    text: 'Patrons',
    trackAs: 'patrons',
    opensInNewWindow: true,
    internal: false,
  },
];


function internationalisationID(countryGroupId: ?CountryGroupId = null): ?string {
  return countryGroups[countryGroupId].supportInternationalisationId;
}

// Export

const Links = ({ location, getRef, countryGroupId }: PropTypes) => (
  <nav className={classNameWithModifiers('component-header-links', [location])}>
    <ul className="component-header-links__ul" ref={getRef}>
      {
        links.filter(({ include }) => {

        // If there is no country group ID for the link, return true and include the link in the rendering.
        if (!countryGroupId) {
          return true;
        }
        // If the link is not meant to be rendered for a specific CountryGroupID, do not include.
        if (include && !include.includes(countryGroupId)) {
          return false;
        }

        // Otherwise return true.
        return true;
      }).map((link) => {
        const internationalisationIDValue = internationalisationID(countryGroupId);

        if (internationalisationIDValue == null || !link.internal) {
          return link;
        }

        return { ...link, href: `/${internationalisationIDValue}${link.href}` };
      }).map(({
        href, text, trackAs, opensInNewWindow, additionalClasses,
      }) => (
        <li
          className={cx(classNameWithModifiers(
                'component-header-links__li',
                [window.location.href.endsWith(href) ? 'active' : null],
              ), additionalClasses)}
        >
          <a
            onClick={() => { trackComponentClick(['header-link', trackAs, location].join(' - ')); }}
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
