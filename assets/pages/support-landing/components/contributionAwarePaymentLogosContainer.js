// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import ContributionAwarePaymentLogos from 'containerisableComponents/contributionAwarePaymentLogos/contributionAwarePaymentLogos';
import type { State } from '../supportLandingReducer';


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    contributionType: state.page.selection.contributionType,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(ContributionAwarePaymentLogos);