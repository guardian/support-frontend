// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { getSubsLinks } from 'helpers/externalLinks';
import { getCampaign } from 'helpers/tracking/acquisitions';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { getDigitalBenefits, getPaperBenefits, getPaperDigitalBenefits } from 'helpers/flashSale';
import { displayPrice } from 'helpers/subscriptions';

import ThreeSubscriptions from 'components/threeSubscriptions/threeSubscriptions';
import SubscriptionBundle from 'components/subscriptionBundle/subscriptionBundle';
import { gridImageProperties } from 'components/threeSubscriptions/helpers/gridImageProperties';

import type { State } from '../supportLandingReducer';


// ----- Types ----- //

type PropTypes = {
  referrerAcquisitionData: ReferrerAcquisitionData,
  countryGroupId: CountryGroupId,
};


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    countryGroupId: state.common.internationalisation.countryGroupId,
  };

}


// ----- Component ----- //

function SubscriptionsSection(props: PropTypes) {

  const subsLinks = getSubsLinks(
    props.countryGroupId,
    props.referrerAcquisitionData.campaignCode,
    getCampaign(props.referrerAcquisitionData),
    props.referrerAcquisitionData,
  );

  return (
    <ThreeSubscriptions>
      <SubscriptionBundle
        modifierClass="digital"
        heading="Digital"
        subheading={displayPrice('DigitalPack', props.countryGroupId)}
        benefits={{ list: true, benefits: getDigitalBenefits() }}
        gridImage={{
          gridId: 'digitalCircle',
          altText: 'digital subscription',
          ...gridImageProperties,
        }}
        headingSize={3}
        ctas={[
          {
            text: 'Start your 14 day trial',
            url: subsLinks.DigitalPack,
            accessibilityHint: 'Find out how to sign up for a free trial of The Guardian\'s digital subscription.',
            modifierClasses: ['digital', 'border'],
          },
        ]}
      />
      <SubscriptionBundle
        modifierClass="paper"
        heading="Paper"
        subheading={`from ${displayPrice('Paper', props.countryGroupId)}`}
        benefits={{ list: true, benefits: getPaperBenefits() }}
        gridImage={{
          gridId: 'paperCircle',
          altText: 'paper subscription',
          ...gridImageProperties,
        }}
        headingSize={3}
        ctas={[
          {
            text: 'Get a paper subscription',
            url: subsLinks.Paper,
            accessibilityHint: 'Proceed to paper subscription options',
            modifierClasses: ['paper', 'border'],
          },
        ]}
      />
      <SubscriptionBundle
        modifierClass="paper-digital"
        heading="Paper+Digital"
        subheading={`from ${displayPrice('PaperAndDigital', props.countryGroupId)}`}
        benefits={{ list: true, benefits: getPaperDigitalBenefits() }}
        gridImage={{
          gridId: 'paperDigitalCircle',
          altText: 'paper + digital subscription',
          ...gridImageProperties,
        }}
        headingSize={3}
        ctas={[
          {
            text: 'Get a paper+digital subscription',
            url: subsLinks.PaperAndDigital,
            accessibilityHint: 'Proceed to choose which days you would like to regularly receive the newspaper in conjunction with a digital subscription',
            modifierClasses: ['paper-digital', 'border'],
          },
        ]}
      />
    </ThreeSubscriptions>
  );

}


// ----- Exports ----- //

export default connect(mapStateToProps)(SubscriptionsSection);
