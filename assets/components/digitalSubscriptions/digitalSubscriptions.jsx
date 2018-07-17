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
        <PremiumTier url="/" />
        <DailyEdition url="/" />
        <DigitalBundle url={subsLinks.digital} />
      </PageSection>
    </div>
  );

}


// ----- Auxiliary Components ----- //

function PremiumTier(props: { url: string }) {

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
      ctaText="Buy in the App Store"
      ctaUrl={props.url}
      ctaAccessibilityHint="The Guardian\'s digital subscription is available for eleven pounds and ninety nine pence per month. Find out how to sign up for a free trial."
      gridImage={{
        gridId: 'digitalCircle',
        altText: 'digital subscription',
        ...gridImageProperties,
      }}
      ctaModifiers={['premium-tier', 'border']}
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
      ctaText="Buy in the App Store"
      ctaUrl={props.url}
      ctaAccessibilityHint="The Guardian\'s digital subscription is available for eleven pounds and ninety nine pence per month. Find out how to sign up for a free trial."
      gridImage={{
        gridId: 'digitalCircle',
        altText: 'digital subscription',
        ...gridImageProperties,
      }}
      ctaModifiers={['daily-edition', 'border']}
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
      ctaText="Start your 14 day trial"
      ctaUrl={props.url}
      ctaAccessibilityHint="The Guardian\'s digital subscription is available for eleven pounds and ninety nine pence per month. Find out how to sign up for a free trial."
      gridImage={{
        gridId: 'digitalCircle',
        altText: 'digital subscription',
        ...gridImageProperties,
      }}
      ctaModifiers={['digital', 'border']}
    />
  );

}
