// @flow

// ----- Imports ----- //

import React from 'react';

import ThreeSubscriptions from 'components/threeSubscriptions/threeSubscriptions';
import { type HeadingSize } from 'components/heading/heading';
import { type SubsUrls } from 'helpers/externalLinks';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import DigitalPack from 'components/subscriptionBundles/digitalPack';
import PremiumTier from 'components/subscriptionBundles/premiumTier';
import Weekly from 'components/subscriptionBundles/weekly';


// ----- Component ----- //

function InternationalSection(props: {
  headingSize: HeadingSize,
  subsLinks: SubsUrls,
  countryGroupId: CountryGroupId,
  appReferrer: string,
}) {

  return (
    <ThreeSubscriptions heading="">
      <PremiumTier
        headingSize={props.headingSize}
        referrer={props.appReferrer}
        subheading="7-day free trial"
      />
      <DigitalPack
        countryGroupId={props.countryGroupId}
        subheading="14-day free trial"
        url={props.subsLinks.DigitalPack}
        gridId="digitalCirclePink"
      />
      <Weekly
        headingSize={props.headingSize}
        subheading="&nbsp;"
        url={props.subsLinks.GuardianWeekly}
      />
    </ThreeSubscriptions>
  );

}


// ----- Exports ----- //

export default InternationalSection;
