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
import { getPrice } from 'helpers/flashSale';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { addQueryParamsToURL } from 'helpers/url';

import PageSection from 'components/pageSection/pageSection';
import SubscriptionBundle from 'components/subscriptionBundle/subscriptionBundle';
import { type HeadingSize } from 'components/heading/heading';


// ----- Types ----- //

type ClickEvent = () => void;

type PropTypes = {
  referrerAcquisitionData: ReferrerAcquisitionData,
  headingSize: HeadingSize,
  clickEvents: {
    iOSApp: ClickEvent,
    androidApp: ClickEvent,
    dailyEdition: ClickEvent,
    digiPack: ClickEvent,
  },
};


// ----- Setup ----- //

const gridImageProperties = {
  srcSizes: [825, 500, 140],
  sizes: '(max-width: 660px) 165px, (max-width: 740px) 174px, (max-width: 980px) 196px, (max-width: 1140px) 205px, 165px',
  imgType: 'png',
};

const appReferrer = 'utm_source=support.theguardian.com&utm_medium=subscribe_landing_page&utm_campaign=split_subscriptions_test';


// ----- Component ----- //

export default function DigitalSubscriptions(props: PropTypes) {

  const subsLinks = getSubsLinks(
    props.referrerAcquisitionData.campaignCode,
    getCampaign(props.referrerAcquisitionData),
    [],
    props.referrerAcquisitionData,
  );

  return (
    <div className="component-digital-subscriptions">
      <PageSection
        heading="Digital Subscriptions"
        modifierClass="digital-subscriptions"
      >
        <PremiumTier
          iOSUrl={addQueryParamsToURL(iOSAppUrl, { referrer: appReferrer })}
          androidUrl={addQueryParamsToURL(androidAppUrl, { referrer: appReferrer })}
          headingSize={props.headingSize}
          iOSOnClick={props.clickEvents.iOSApp}
          androidOnClick={props.clickEvents.androidApp}
        />
        <DailyEdition
          url={addQueryParamsToURL(dailyEditionUrl, { referrer: appReferrer })}
          headingSize={props.headingSize}
          onClick={props.clickEvents.dailyEdition}
        />
        <DigitalBundle
          url={subsLinks.digital}
          headingSize={props.headingSize}
          onClick={props.clickEvents.digiPack}
        />
      </PageSection>
    </div>
  );

}


// ----- Auxiliary Components ----- //

function PremiumTier(props: {
    iOSUrl: string,
    androidUrl: string,
    headingSize: HeadingSize,
    iOSOnClick: ClickEvent,
    androidOnClick: ClickEvent,
}) {

  return (
    <SubscriptionBundle
      modifierClass="premium-tier"
      heading="Premium App"
      subheading="£5.99/month"
      headingSize={props.headingSize}
      benefits={[
        {
          text: 'The ad free, premium app, designed especially for your smartphone and tablet',
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
          onClick: props.iOSOnClick,
        },
        {
          text: 'Buy on Google Play',
          url: props.androidUrl,
          accessibilityHint: 'Proceed to buy the premium app in the play store',
          modifierClasses: ['premium-tier', 'border', 'android'],
          onClick: props.androidOnClick,
        },
      ]}
    />
  );

}

function DailyEdition(props: {
  url: string,
  headingSize: HeadingSize,
  onClick: ClickEvent,
}) {

  return (
    <SubscriptionBundle
      modifierClass="daily-edition"
      heading="Daily Edition"
      subheading="from £6.99/month"
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
          onClick: props.onClick,
        },
      ]}
    />
  );

}

function DigitalBundle(props: {
  url: string,
  headingSize: HeadingSize,
  onClick: ClickEvent,
}) {

  return (
    <SubscriptionBundle
      modifierClass="digital"
      heading="Digital Pack"
      subheading={`£${getPrice('digital', '11.99')}/month`}
      headingSize={props.headingSize}
      benefits={[
        {
          text: 'The premium app and the daily edition in one pack',
        },
      ]}
      gridImage={{
        gridId: 'digitalCircleAlt',
        altText: 'digital subscription',
        ...gridImageProperties,
      }}
      ctas={[
        {
          text: 'Find out more',
          url: props.url,
          accessibilityHint: 'Find out how to sign up for a free trial of The Guardian\'s digital subscription.',
          modifierClasses: ['digital', 'border'],
          onClick: props.onClick,
        },
      ]}
    />
  );

}

export {
  DigitalBundle,
  PremiumTier,
  DailyEdition,
};
