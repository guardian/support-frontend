// @flow

// ----- Imports ----- //

import React from 'react';

import ThreeSubscriptions from 'components/threeSubscriptions/threeSubscriptions';
import { type HeadingSize } from 'components/heading/heading';

import { type ComponentAbTest, displayPrice } from 'helpers/subscriptions';
import { type SubsUrls } from 'helpers/externalLinks';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import PremiumTier from 'components/subscriptionBundles/premiumTier';
import DigitalPack from 'components/subscriptionBundles/digitalPack';
import DailyEdition from 'components/subscriptionBundles/dailyEdition';

// ----- Types ----- //

type PropTypes = {|
  headingSize: HeadingSize,
  subsLinks: SubsUrls,
  countryGroupId: CountryGroupId,
  appReferrer: string,
  abTest: ComponentAbTest | null,
|};


// ----- Component ----- //

function DigitalSection(props: PropTypes) {
  return (
    <ThreeSubscriptions heading="">
      <PremiumTier
        headingSize={props.headingSize}
        referrer={props.appReferrer}
        subheading={displayPrice('PremiumTier', props.countryGroupId)}
        abTest={props.abTest}
      />
      <DailyEdition
        headingSize={props.headingSize}
        countryGroupId={props.countryGroupId}
        appReferrer={props.appReferrer}
        abTest={props.abTest}
      />
      <DigitalPack
        countryGroupId={props.countryGroupId}
        url={props.subsLinks.DigitalPack}
        gridId="digitalCircleOrange"
        abTest={props.abTest}
      />
    </ThreeSubscriptions>
  );
}


// ----- Default Props ----- //

DigitalSection.defaultProps = {
  abTest: null,
};


// ----- Exports ----- //

export default DigitalSection;
