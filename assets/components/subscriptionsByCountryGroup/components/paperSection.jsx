// @flow

// ----- Imports ----- //

import React from 'react';

import ThreeSubscriptions from 'components/threeSubscriptions/threeSubscriptions';
import SubscriptionBundle from 'components/subscriptionBundle/subscriptionBundle';
import { gridImageProperties } from 'components/threeSubscriptions/helpers/gridImageProperties';
import { type HeadingSize } from 'components/heading/heading';

import { displayPrice } from 'helpers/subscriptions';
import { type SubsUrls } from 'helpers/externalLinks';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { sendTrackingEventsOnClick, type ComponentAbTest } from 'helpers/subscriptions';

import Weekly from './weekly';


// ----- Types ----- //

type PropTypes = {|
  headingSize: HeadingSize,
  subsLinks: SubsUrls,
  countryGroupId: CountryGroupId,
  abTest: ComponentAbTest | void,
|};


// ----- Component ----- //

function PaperSection(props: PropTypes) {

  return (
    <ThreeSubscriptions heading="Print Subscriptions">
      <SubscriptionBundle
        modifierClass="paper"
        heading="Paper"
        subheading={`from ${displayPrice('Paper', props.countryGroupId)}`}
        headingSize={props.headingSize}
        benefits={{
          list: false,
          copy: 'Save on The Guardian and The Observer\'s newspaper retail price all year round',
        }}
        gridImage={{
          gridId: 'paperCircle',
          altText: 'paper subscription',
          ...gridImageProperties,
        }}
        ctas={[
          {
            text: 'Choose a package',
            url: props.subsLinks.Paper,
            accessibilityHint: 'Proceed to paper subscription options',
            modifierClasses: ['border'],
            onClick: sendTrackingEventsOnClick('paper_cta', 'print', props.abTest),
          },
        ]}
      />
      <SubscriptionBundle
        modifierClass="paper-digital"
        heading="Paper+Digital"
        subheading={`from ${displayPrice('PaperAndDigital', props.countryGroupId)}`}
        headingSize={props.headingSize}
        benefits={{
          list: false,
          copy: 'All the benefits of a paper subscription, plus access to the digital pack',
        }}
        gridImage={{
          gridId: 'paperDigitalCircleAlt',
          altText: 'paper + digital subscription',
          ...gridImageProperties,
        }}
        ctas={[
          {
            text: 'Choose a package',
            url: props.subsLinks.PaperAndDigital,
            accessibilityHint: 'Proceed to choose which days you would like to regularly receive the newspaper in conjunction with a digital subscription',
            modifierClasses: ['border'],
            onClick: sendTrackingEventsOnClick('paper_digital_cta', 'print', props.abTest),
          },
        ]}
      />
      <Weekly
        headingSize={props.headingSize}
        url={props.subsLinks.GuardianWeekly}
        subheading={displayPrice('GuardianWeekly', props.countryGroupId)}
        abTest={props.abTest}
      />
    </ThreeSubscriptions>
  );

}

// ----- Default Props ----- //

PaperSection.defaultProps = {
  abTest: undefined,
};


// ----- Exports ----- //

export default PaperSection;
