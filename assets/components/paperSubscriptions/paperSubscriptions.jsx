// @flow

// ----- Imports ----- //

import React from 'react';

import { getSubsLinks } from 'helpers/externalLinks';
import { getCampaign } from 'helpers/tracking/acquisitions';
import { getPaperBenefits, getPaperDigitalBenefits, getPrice } from 'helpers/flashSale';

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

export default function PaperSubscriptions(props: PropTypes) {

  const subsLinks = getSubsLinks(
    props.referrerAcquisitionData.campaignCode,
    getCampaign(props.referrerAcquisitionData),
    [],
    props.referrerAcquisitionData,
  );

  return (
    <div className="component-paper-subscriptions">
      <PageSection heading="Print Subscriptions" modifierClass="paper-subscriptions">
        <PaperBundle url={subsLinks.paper} />
        <PaperDigitalBundle url={subsLinks.paperDig} />
        <WeeklyBundle url="/" />
      </PageSection>
    </div>
  );

}


// ----- Auxiliary Components ----- //

function PaperBundle(props: { url: string }) {

  return (
    <SubscriptionBundle
      modifierClass="paper"
      heading="Paper"
      subheading={`from £${getPrice('paper', '10.36')}/month`}
      benefits={getPaperBenefits()}
      gridImage={{
        gridId: 'paperCircle',
        altText: 'paper subscription',
        ...gridImageProperties,
      }}
      ctas={[
        {
          text: 'Get a paper subscription',
          url: props.url,
          accessibilityHint: 'Proceed to paper subscription options, starting at ten pounds seventy nine pence per month.',
          modifierClasses: ['paper', 'border'],
        },
      ]}
    />
  );

}

function PaperDigitalBundle(props: { url: string }) {

  return (
    <SubscriptionBundle
      modifierClass="paper-digital"
      heading="Paper+digital"
      subheading={`from £${getPrice('paperAndDigital', '21.62')}/month`}
      benefits={getPaperDigitalBenefits()}
      gridImage={{
        gridId: 'paperDigitalCircle',
        altText: 'paper + digital subscription',
        ...gridImageProperties,
      }}
      ctas={[
        {
          text: 'Get a paper+digital subscription',
          url: props.url,
          accessibilityHint: 'Proceed to choose which days you would like to regularly receive the newspaper in conjunction with a digital subscription',
          modifierClasses: ['paper-digital', 'border'],
        },
      ]}
    />
  );

}

function WeeklyBundle(props: { url: string }) {

  return (
    <SubscriptionBundle
      modifierClass="weekly"
      heading="Guardian Weekly"
      subheading="£30/quarter"
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
      ctaText="Get a weekly subscription"
      ctaUrl={props.url}
      ctaAccessibilityHint="The Guardian\'s weekly subscription is available for eleven pounds and ninety nine pence per month. Find out how to sign up for a free trial."
      gridImage={{
        gridId: 'digitalCircle',
        altText: 'digital subscription',
        ...gridImageProperties,
      }}
      ctaModifiers={['weekly', 'border']}
      ctas={[
        {
          text: 'Get a weekly subscription',
          url: props.url,
          accessibilityHint: 'The Guardian\'s weekly subscription is available for thirty pounds per quarter',
          modifierClasses: ['weekly', 'border'],
        },
      ]}
    />
  );

}
