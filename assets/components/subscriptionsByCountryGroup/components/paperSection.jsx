// @flow

// ----- Imports ----- //

import React from 'react';

import ThreeSubscriptions from 'components/threeSubscriptions/threeSubscriptions';
import { type HeadingSize } from 'components/heading/heading';

import { type ComponentAbTest, displayPrice } from 'helpers/subscriptions';
import { type SubsUrls } from 'helpers/externalLinks';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import Paper from 'components/subscriptionBundles/paper';
import PaperDigital from 'components/subscriptionBundles/paperDigital';
import Weekly from 'components/subscriptionBundles/weekly';

// ----- Types ----- //

type PropTypes = {|
  headingSize: HeadingSize,
  subsLinks: SubsUrls,
  countryGroupId: CountryGroupId,
  abTest: ComponentAbTest | null,
|};


// ----- Component ----- //

function PaperSection(props: PropTypes) {

  return (
    <ThreeSubscriptions heading="Print Subscriptions">
      <Paper
        url={props.subsLinks.Paper}
        countryGroupId={props.countryGroupId}
        abTest={props.abTest}
      />
      <PaperDigital
        url={props.subsLinks.PaperAndDigital}
        countryGroupId={props.countryGroupId}
        abTest={props.abTest}
        gridId="paperDigitalCirclePink"
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
  abTest: null,
};


// ----- Exports ----- //

export default PaperSection;
