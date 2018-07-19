// @flow

// ----- Imports ----- //

import React from 'react';

import { getSubsLinks } from 'helpers/externalLinks';
import { getCampaign } from 'helpers/tracking/acquisitions';
import { getDigitalBenefits, getPrice } from 'helpers/flashSale';

import PageSection from 'components/pageSection/pageSection';
import SubscriptionBundle from 'components/subscriptionBundle/subscriptionBundle';

import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';


// ----- Types ----- //

type PropTypes = {
  referrerAcquisitionData: ReferrerAcquisitionData,
};


// ----- Setup ----- //

const gridImageProperties = {
  srcSizes: [825, 500, 140],
  sizes: '(max-width: 660px) 165px, (max-width: 740px) 174px, (max-width: 980px) 196px, (max-width: 1140px) 205px, 165px',
  imgType: 'png',
};


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
        <PremiumTier iosUrl="/" androidUrl="/" />
        <DailyEdition url="/" />
        <DigitalBundle url={subsLinks.digital} />
      </PageSection>
    </div>
  );

}


// ----- Auxiliary Components ----- //

function PremiumTier(props: { iosUrl: string, androidUrl: string }) {

  return (
    <SubscriptionBundle
      modifierClass="premium-tier"
      heading="Premium Tier"
      subheading="£5.99/month"
      benefits={[
        {
          heading: 'Premium experience on the Guardian app',
          text: 'No adverts means faster loading pages and a clearer reading experience. Play our daily crosswords offline wherever you are',
        },
        {
          heading: 'Daily Tablet Edition app',
          text: 'Read the Guardian, the Observer and all the Weekend supplements in an optimised tablet app; available on iPad',
        },
      ]}
      gridImage={{
        gridId: 'digitalCircle',
        altText: 'digital subscription',
        ...gridImageProperties,
      }}
      ctas={[
        {
          text: 'Buy in the App Store',
          url: props.iosUrl,
          accessibilityHint: 'Proceed to buy the premium app in the app store',
          modifierClasses: ['premium-tier', 'border'],
        },
        {
          text: 'Buy in the Play Store',
          url: props.androidUrl,
          accessibilityHint: 'Proceed to buy the premium app in the play store',
          modifierClasses: ['premium-tier', 'border'],
        },
      ]}
    />
  );

}

function DailyEdition(props: { url: string }) {

  return (
    <SubscriptionBundle
      modifierClass="daily-edition"
      heading="Daily Edition"
      subheading="from £6.99/month"
      benefits={[
        {
          heading: 'Premium experience on the Guardian app',
          text: 'No adverts means faster loading pages and a clearer reading experience. Play our daily crosswords offline wherever you are',
        },
        {
          heading: 'Daily Tablet Edition app',
          text: 'Read the Guardian, the Observer and all the Weekend supplements in an optimised tablet app; available on iPad',
        },
      ]}
      gridImage={{
        gridId: 'digitalCircle',
        altText: 'digital subscription',
        ...gridImageProperties,
      }}
      ctas={[
        {
          text: 'Buy in the App Store',
          url: props.url,
          accessibilityHint: 'Proceed to buy the daily edition app in the app store',
          modifierClasses: ['daily-edition', 'border'],
        },
      ]}
    />
  );

}

function DigitalBundle(props: { url: string }) {

  return (
    <SubscriptionBundle
      modifierClass="digital"
      heading="Digital"
      subheading={`£${getPrice('digital', '11.99')}/month`}
      benefits={getDigitalBenefits()}
      gridImage={{
        gridId: 'digitalCircle',
        altText: 'digital subscription',
        ...gridImageProperties,
      }}
      ctas={[
        {
          text: 'Start your 14 day trial',
          url: props.url,
          accessibilityHint: 'The Guardian\'s digital subscription is available for eleven pounds and ninety nine pence per month. Find out how to sign up for a free trial.',
          modifierClasses: ['digital', 'border'],
        },
      ]}
    />
  );

}
