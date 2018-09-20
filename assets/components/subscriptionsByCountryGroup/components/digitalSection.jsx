// @flow

// ----- Imports ----- //

import React from 'react';

import ThreeSubscriptions from 'components/threeSubscriptions/threeSubscriptions';
import SubscriptionBundle from 'components/subscriptionBundle/subscriptionBundle';
import { gridImageProperties } from 'components/threeSubscriptions/helpers/gridImageProperties';
import { type HeadingSize } from 'components/heading/heading';

import { addQueryParamsToURL } from 'helpers/url';
import { dailyEditionUrl } from 'helpers/externalLinks';
import { appStoreCtaClick } from 'helpers/tracking/googleTagManager';
import { displayPrice, displayDigitalPackBenefitCopy } from 'helpers/subscriptions';
import { type SubsUrls } from 'helpers/externalLinks';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import PremiumTier from './premiumTier';
import DigitalPack from './digitalPack';


// ----- Component ----- //

function DigitalSection(props: {
  headingSize: HeadingSize,
  subsLinks: SubsUrls,
  countryGroupId: CountryGroupId,
  appReferrer: string,
}) {
  return (
    <ThreeSubscriptions heading="Digital Subscriptions">
      <PremiumTier
        headingSize={props.headingSize}
        referrer={props.appReferrer}
        subheading={displayPrice('PremiumTier', props.countryGroupId)}
      />
      <SubscriptionBundle
        modifierClass="daily-edition"
        heading="Daily Edition"
        subheading={displayPrice('DailyEdition', props.countryGroupId)}
        headingSize={props.headingSize}
        benefits={{
          list: false,
          copy: 'Your complete daily UK newspaper, designed for iPad and available offline',
        }}
        gridImage={{
          gridId: 'dailyEditionCircle',
          altText: 'daily edition',
          ...gridImageProperties,
        }}
        ctas={[
          {
            text: 'Buy in the App Store',
            url: addQueryParamsToURL(dailyEditionUrl, { referrer: props.appReferrer }),
            accessibilityHint: 'Proceed to buy the daily edition app for iPad in the app store',
            modifierClasses: ['border'],
            onClick: appStoreCtaClick,
          },
        ]}
      />
      <DigitalPack
        headingSize={props.headingSize}
        url={props.subsLinks.DigitalPack}
        subheading={displayPrice('DigitalPack', props.countryGroupId)}
        gridId="digitalCircleAlt"
        copy={displayDigitalPackBenefitCopy(props.countryGroupId)}
      />
    </ThreeSubscriptions>
  );
}


// ----- Exports ----- //

export default DigitalSection;
