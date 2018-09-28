// @flow

// ----- Imports ----- //

import React from 'react';

import ThreeSubscriptions from 'components/threeSubscriptions/threeSubscriptions';
import { displayDigitalPackBenefitCopy } from 'helpers/subscriptions';

import { type HeadingSize } from 'components/heading/heading';
import { type SubsUrls } from 'helpers/externalLinks';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import PremiumTier from './premiumTier';
import DigitalPack from './digitalPack';
import Weekly from './weekly';


// ----- Component ----- //

function InternationalSection(props: {
  headingSize: HeadingSize,
  subsLinks: SubsUrls,
  countryGroupId: CountryGroupId,
  appReferrer: string,
}) {

  return (
    <ThreeSubscriptions>
      <PremiumTier headingSize={props.headingSize} referrer={props.appReferrer} subheading="7-day free trial" />
      <DigitalPack
        headingSize={props.headingSize}
        url={props.subsLinks.DigitalPack}
        subheading="14-day free trial"
        gridId="digitalCircleInternational"
        copy={displayDigitalPackBenefitCopy(props.countryGroupId)}
      />
      <Weekly headingSize={props.headingSize} subheading="&nbsp;" url={props.subsLinks.GuardianWeekly} />
    </ThreeSubscriptions>
  );

}


// ----- Exports ----- //

export default InternationalSection;
