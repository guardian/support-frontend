// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import ContributionPaymentCtas from 'components/contributionPaymentCtas/contributionPaymentCtas';
import {
  getAmount,
} from 'components/contributionSelection/contributionSelectionReducer';

import type { State } from '../supportLandingReducer';


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    contributionType: state.page.selection.contributionType,
    amount: getAmount(state.page.selection),
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    country: state.common.country,
    currency: state.common.currency,
    canClick: !state.page.selection.error,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(ContributionPaymentCtas);
