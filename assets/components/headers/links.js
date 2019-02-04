// @flow
import { routes } from 'helpers/routes';
import { getPatronsLink } from 'helpers/externalLinks';

type HeaderNavLink = {
  href: string,
  text: string
}

export const links: HeaderNavLink[] = [
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
