// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import ContributionSelection from 'components/contributionSelection/contributionSelection';

import type { State } from '../supportLanding';


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    campaignCode: state.common.referrerAcquisitionData.campaignCode,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(ContributionSelection);
