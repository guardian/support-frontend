// @flow

// ----- Imports  ----- //

import React from 'react';
import SubscriptionBundle from 'components/subscriptionBundle/subscriptionBundle';
import { gridImageProperties } from 'components/threeSubscriptions/helpers/gridImageProperties';

import { appStoreCtaClick } from 'helpers/tracking/googleTagManager';
import { addQueryParamsToURL } from 'helpers/url';
import { dailyEditionUrl } from 'helpers/externalLinks';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { displayPrice } from 'helpers/subscriptions';
import type { HeadingSize } from 'components/heading/heading';


export default function DailyEdition(props: {
  headingSize: HeadingSize,
  countryGroupId: CountryGroupId,
  appReferrer: string,
}) {
  return (
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
  );
}
