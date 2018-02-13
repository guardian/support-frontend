// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import ContributionPaymentCtas from 'components/contributionPaymentCtas/contributionPaymentCtas';
import {
  getAmount,
} from 'components/contributionSelection/contributionSelectionReducer';

import type { State } from '../contributionsLandingUK';


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    contributionType: state.page.contributionType,
    amount: getAmount(state.page),
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    country: state.common.country,
    currency: state.common.currency,
    canClick: !state.page.error,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(ContributionPaymentCtas);
