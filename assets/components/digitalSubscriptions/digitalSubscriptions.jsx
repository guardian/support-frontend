// @flow

// ----- Imports ----- //

import React from 'react';

import {
  getSubsLinks,
  iOSAppUrl,
  androidAppUrl,
  dailyEditionUrl,
} from 'helpers/externalLinks';
import { getCampaign } from 'helpers/tracking/acquisitions';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { addQueryParamsToURL } from 'helpers/url';

import PageSection from 'components/pageSection/pageSection';
import SubscriptionBundle from 'components/subscriptionBundle/subscriptionBundle';
import { type HeadingSize } from 'components/heading/heading';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { displayPrice } from 'helpers/subscriptions';


// ----- Types ----- //

type PropTypes = {
  referrerAcquisitionData: ReferrerAcquisitionData,
  headingSize: HeadingSize,
};


// ----- Setup ----- //

const gridImageProperties = {
  srcSizes: [825, 500, 140],
  sizes: '(max-width: 660px) 165px, (max-width: 740px) 174px, (max-width: 980px) 196px, (max-width: 1140px) 205px, 165px',
  imgType: 'png',
};

const appReferrer = 'utm_source=support.theguardian.com&utm_medium=subscribe_landing_page';


// ----- Component ----- //

export default function DigitalSubscriptions(props: PropTypes) {
  const countryGroupId = 'GBPCountries'; // This component is only used in the UK
  const subsLinks = getSubsLinks(
    countryGroupId,
    props.referrerAcquisitionData.campaignCode,
    getCampaign(props.referrerAcquisitionData),
    props.referrerAcquisitionData,
  );

  return (
    <div className="component-digital-subscriptions">
      <PageSection
        heading="Digital Subscriptions"
        modifierClass="digital-subscriptions"
      >
        <PremiumTier
          countryGroupId={countryGroupId}
          iOSUrl={addQueryParamsToURL(iOSAppUrl, { referrer: appReferrer })}
          androidUrl={addQueryParamsToURL(androidAppUrl, { referrer: appReferrer })}
          headingSize={props.headingSize}
        />
        <DailyEdition
          url={addQueryParamsToURL(dailyEditionUrl, { referrer: appReferrer })}
          headingSize={props.headingSize}
        />
        <DigitalBundle
          countryGroupId={countryGroupId}
          url={subsLinks.DigitalPack}
          headingSize={props.headingSize}
        />
      </PageSection>
    </div>
  );

}

// ----- Auxiliary Components ----- //

function PremiumTier(props: {
    countryGroupId: CountryGroupId,
    iOSUrl: string,
    androidUrl: string,
    headingSize: HeadingSize,
    subheading: ?string,
}) {

  return (
    <SubscriptionBundle
      modifierClass="premium-tier"
      heading="Premium App"
      subheading={props.subheading || displayPrice('PremiumTier', props.countryGroupId)}
      headingSize={props.headingSize}
      benefits={[
        {
          text: 'The ad-free, premium app, designed especially for your smartphone and tablet',
        },
      ]}
      gridImage={{
        gridId: 'premiumTierCircle',
        altText: 'premium app',
        ...gridImageProperties,
      }}
      ctas={[
        {
          text: 'Buy in the App Store',
          url: props.iOSUrl,
          accessibilityHint: 'Proceed to buy the premium app in the app store',
          modifierClasses: ['premium-tier', 'border', 'ios'],
        },
        {
          text: 'Buy on Google Play',
          url: props.androidUrl,
          accessibilityHint: 'Proceed to buy the premium app in the play store',
          modifierClasses: ['premium-tier', 'border', 'android'],
        },
      ]}
    />
  );

}

PremiumTier.defaultProps = {
  subheading: null,
};

function DailyEdition(props: {
  url: string,
  headingSize: HeadingSize,
}) {

  return (
    <SubscriptionBundle
      modifierClass="daily-edition"
      heading="Daily Edition"
      subheading={`from ${displayPrice('DailyEdition', 'GBPCountries')}`}
      headingSize={props.headingSize}
      benefits={[
        {
          text: 'Your complete daily UK newspaper, designed for iPad and available offline',
        },
      ]}
      gridImage={{
        gridId: 'dailyEditionCircle',
        altText: 'daily edition',
        ...gridImageProperties,
      }}
      ctas={[
        {
          text: 'Buy in the App Store',
          url: props.url,
          accessibilityHint: 'Proceed to buy the daily edition app for iPad in the app store',
          modifierClasses: ['daily-edition', 'border'],
        },
      ]}
    />
  );

}

function DigitalBundle(props: {
  countryGroupId: CountryGroupId,
  url: string,
  headingSize: HeadingSize,
  subheading: ?string,
}) {

  const i13n = props.countryGroupId === 'GBPCountries' ?
    {
      gridId: 'digitalCircleAlt',
      benefits: 'The premium app and the daily edition iPad app in one pack, plus no ads when you sign in on theguardian.com',
    } :
    {
      gridId: 'digitalCircleInternational',
      benefits: 'The premium app and the daily edition iPad app of the UK newspaper in one pack, plus no ads when you sign in on theguardian.com',
    };


  return (
    <SubscriptionBundle
      modifierClass="digital"
      heading="Digital Pack"
      subheading={props.subheading || displayPrice('DigitalPack', props.countryGroupId)}
      headingSize={props.headingSize}
      benefits={[
        {
          text: i13n.benefits,
        },
      ]}
      gridImage={{
        gridId: i13n.gridId,
        altText: 'digital subscription',
        ...gridImageProperties,
      }}
      ctas={[
        {
          text: 'Find out more',
          url: props.url,
          accessibilityHint: 'Find out how to sign up for a free trial of The Guardian\'s digital subscription.',
          modifierClasses: ['digital', 'border'],
        },
      ]}
    />
  );

}

DigitalBundle.defaultProps = {
  subheading: null,
};

export {
  DigitalBundle,
  PremiumTier,
  DailyEdition,
};
