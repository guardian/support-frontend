// @flow

// ----- Imports ----- //

import React from 'react';

import { getSubsLinks } from 'helpers/externalLinks';
import { getCampaign } from 'helpers/tracking/acquisitions';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';

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


// ----- Component ----- //

export default function PaperSubscriptions(props: PropTypes) {

  const subsLinks = getSubsLinks(
    'GBPCountries',
    props.referrerAcquisitionData.campaignCode,
    getCampaign(props.referrerAcquisitionData),
    props.referrerAcquisitionData,
  );

  return (
    <div className="component-paper-subscriptions">
      <PageSection heading="Print Subscriptions" modifierClass="paper-subscriptions">
        <PaperBundle
          url={subsLinks.Paper}
          headingSize={props.headingSize}
        />
        <PaperDigitalBundle
          url={subsLinks.PaperAndDigital}
          headingSize={props.headingSize}
        />
        <WeeklyBundle
          countryGroupId="GBPCountries"
          url={subsLinks.GuardianWeekly}
          headingSize={props.headingSize}
        />
      </PageSection>
    </div>
  );

}

// ----- Auxiliary Components ----- //

function PaperBundle(props: {
  url: string,
  headingSize: HeadingSize,
}) {

  return (
    <SubscriptionBundle
      modifierClass="paper"
      heading="Paper"
      subheading={`from ${displayPrice('Paper', 'GBPCountries')}`}
      headingSize={props.headingSize}
      benefits={[
        {
          text: 'Save on The Guardian and The Observer\'s newspaper retail price all year round',
        },
      ]}
      gridImage={{
        gridId: 'paperCircle',
        altText: 'paper subscription',
        ...gridImageProperties,
      }}
      ctas={[
        {
          text: 'Choose a package',
          url: props.url,
          accessibilityHint: 'Proceed to paper subscription options',
          modifierClasses: ['paper', 'border'],
        },
      ]}
    />
  );

}

function PaperDigitalBundle(props: {
  url: string,
  headingSize: HeadingSize,
}) {

  return (
    <SubscriptionBundle
      modifierClass="paper-digital"
      heading="Paper+Digital"
      subheading={`from ${displayPrice('PaperAndDigital', 'GBPCountries')}`}
      headingSize={props.headingSize}
      benefits={[
        {
          text: 'All the benefits of a paper subscription, plus access to the digital pack',
        },
      ]}
      gridImage={{
        gridId: 'paperDigitalCircleAlt',
        altText: 'paper + digital subscription',
        ...gridImageProperties,
      }}
      ctas={[
        {
          text: 'Choose a package',
          url: props.url,
          accessibilityHint: 'Proceed to choose which days you would like to regularly receive the newspaper in conjunction with a digital subscription',
          modifierClasses: ['paper-digital', 'border'],
        },
      ]}
    />
  );

}

function WeeklyBundle(props: {
  countryGroupId: CountryGroupId,
  url: string,
  headingSize: HeadingSize,
  subheading: ?string,
}) {

  return (
    <SubscriptionBundle
      modifierClass="weekly"
      heading="Guardian&nbsp;Weekly"
      subheading={props.subheading || displayPrice('GuardianWeekly', props.countryGroupId)}
      headingSize={props.headingSize}
      benefits={[
        {
          text: 'A weekly, global newspaper from The Guardian, with free delivery worldwide',
        },
      ]}
      gridImage={{
        gridId: 'weeklyCircle',
        altText: 'weekly subscription',
        ...gridImageProperties,
      }}
      ctas={[
        {
          text: 'Find out more',
          url: props.url,
          accessibilityHint: 'Proceed to buy a subscription to The Guardian Weekly',
          modifierClasses: ['weekly', 'border'],
        },
      ]}
    />
  );
}

WeeklyBundle.defaultProps = {
  subheading: null,
};

export {
  PaperBundle,
  WeeklyBundle,
  PaperDigitalBundle,
};
