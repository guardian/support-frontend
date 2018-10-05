// @flow

// ----- Imports  ----- //

import React from 'react';

import { type HeadingSize } from 'components/heading/heading';
import SubscriptionBundle from 'components/subscriptionBundle/subscriptionBundle';
import { gridImageProperties } from 'components/threeSubscriptions/helpers/gridImageProperties';

import { iOSAppUrl, androidAppUrl } from 'helpers/externalLinks';
import { addQueryParamsToURL } from 'helpers/url';
import { appStoreCtaClick } from 'helpers/tracking/googleTagManager';


// ----- Component ----- //

function PremiumTier(props: {
  headingSize: HeadingSize,
  subheading: string,
  referrer: string,
}) {

  return (
    <SubscriptionBundle
      modifierClass="premium-tier"
      heading="Premium App"
      subheading={props.subheading}
      headingSize={props.headingSize}
      benefits={{
        list: false,
        copy: 'The ad-free, premium app, designed especially for your smartphone and tablet',
      }}
      gridImage={{
        gridId: 'premiumTierCircle',
        altText: 'premium app',
        ...gridImageProperties,
      }}
      ctas={[
        {
          text: 'Buy in the App Store',
          url: addQueryParamsToURL(iOSAppUrl, { referrer: props.referrer }),
          accessibilityHint: 'Proceed to buy the premium app in the app store',
          modifierClasses: ['border', 'ios'],
          onClick: appStoreCtaClick,
        },
        {
          text: 'Buy on Google Play',
          url: addQueryParamsToURL(androidAppUrl, { referrer: props.referrer }),
          accessibilityHint: 'Proceed to buy the premium app in the play store',
          modifierClasses: ['border', 'android'],
          onClick: appStoreCtaClick,
        },
      ]}
    />
  );

}


// ----- Exports ----- //

export default PremiumTier;
