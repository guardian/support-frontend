// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { getSubsLinks } from 'helpers/externalLinks';
import { getCampaign, type ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type Participations } from 'helpers/abTests/abtest';
import { type OptimizeExperiments } from 'helpers/optimize/optimize';

import ThreeSubscriptions from 'components/threeSubscriptions/threeSubscriptions';
import DigitalPack from 'components/subscriptionBundles/digitalPack';
import Paper from 'components/subscriptionBundles/paper';
import PaperDigital from 'components/subscriptionBundles/paperDigital';
import type { State } from '../supportLandingReducer';

// ----- Types ----- //

type PropTypes = {|
  referrerAcquisitionData: ReferrerAcquisitionData,
  countryGroupId: CountryGroupId,
  abParticipations: Participations,
  optimizeExperiments: OptimizeExperiments,
|};


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    countryGroupId: state.common.internationalisation.countryGroupId,
    abParticipations: state.common.abParticipations,
    optimizeExperiments: state.common.optimizeExperiments,
  };

}


// ----- Component ----- //

function SubscriptionsSection(props: PropTypes) {

  const subsLinks = getSubsLinks(
    props.countryGroupId,
    props.referrerAcquisitionData.campaignCode,
    getCampaign(props.referrerAcquisitionData),
    props.referrerAcquisitionData,
    props.abParticipations,
    props.optimizeExperiments,
  );

  return (
    <ThreeSubscriptions>
      <DigitalPack
        url={subsLinks.DigitalPack}
        countryGroupId={props.countryGroupId}
        gridId="digitalCirclePink"
        abTest={props.abParticipations}
      />
      <Paper
        url={subsLinks.Paper}
        countryGroupId={props.countryGroupId}
        abTest={props.abParticipations}
      />
      <PaperDigital
        url={subsLinks.PaperAndDigital}
        countryGroupId={props.countryGroupId}
        abTest={props.abParticipations}
        gridId="paperDigitalCircleOrange"
      />
    </ThreeSubscriptions>
  );

}


// ----- Exports ----- //

export default connect(mapStateToProps)(SubscriptionsSection);
