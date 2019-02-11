// @flow

// ----- Imports  ----- //

import React from 'react';

import { type HeadingSize } from 'components/heading/heading';
import SubscriptionBundle from 'components/subscriptionBundle/subscriptionBundle';
import { gridImageProperties } from 'components/threeSubscriptions/helpers/gridImageProperties';

import { androidAppUrl, getIosAppUrl } from 'helpers/externalLinks';
import { addQueryParamsToURL } from 'helpers/url';
import trackAppStoreLink from 'components/subscriptionBundles/appCtaTracking';
import type { ComponentAbTest } from 'helpers/subscriptions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';


// ----- Component ----- //

function PremiumTier(props: {
  headingSize: HeadingSize,
  subheading: string,
  referrer: string,
  abTest: ComponentAbTest | null,
  countryGroupId: CountryGroupId
}) {

  return (
    <SubscriptionBundle
      modifierClass="premium-tier"
      heading="Premium App"
      subheading={props.subheading}
      headingSize={props.headingSize}
      benefits={{
        list: false,
        copy: 'The ad-free, Premium App, designed especially for your smartphone and tablet',
      }}
      gridImage={{
        gridId: 'premiumTierCircle',
        altText: 'Premium App',
        ...gridImageProperties,
      }}
      ctas={[
        {
          text: 'Buy in the App Store',
          url: addQueryParamsToURL(getIosAppUrl(props.countryGroupId), { referrer: props.referrer }),
          accessibilityHint: 'Proceed to buy the Premium App in the app store',
          modifierClasses: ['border', 'ios'],
          onClick: trackAppStoreLink('premium_tier_ios_cta', 'PremiumTier', props.abTest),
        },
        {
          text: 'Buy on Google Play',
          url: addQueryParamsToURL(androidAppUrl, { referrer: props.referrer }),
          accessibilityHint: 'Proceed to buy the Premium App in the play store',
          modifierClasses: ['border', 'android'],
          onClick: trackAppStoreLink('premium_tier_android_cta', 'PremiumTier', props.abTest),
        },
      ]}
    />
  );

}

PremiumTier.defaultProps = {
  abTest: null,
};


// ----- Exports ----- //

export default PremiumTier;
