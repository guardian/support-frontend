// @flow

import { getQueryParameter } from 'helpers/url';

export type PageContent = { title: string, ctaText: string};

const content = {
  default: {
    title: 'Support The Guardian with a digital subscription',
    ctaText: 'Start a 14 day free trial',
  },
  the_code: { // TODO: need the actual code here
    title: 'Upgrade your subscription to Paper+Digital now',
    ctaText: 'Find out more',
  },
};

export function getPageContent(): PageContent {
  const code = getQueryParameter('promoCode', 'default');
  return content[code] || content.default;
}
