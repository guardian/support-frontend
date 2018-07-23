// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import ContributionAwarePaymentLogos from 'components/contributionAwarePaymentLogos/contributionAwarePaymentLogos';
import type { State } from '../contributionsLandingReducer';


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    contributionType: state.page.selection.contributionType,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(ContributionAwarePaymentLogos);
