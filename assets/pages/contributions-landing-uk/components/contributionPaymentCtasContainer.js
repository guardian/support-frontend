// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import ContributionPaymentCtas from 'components/contributionPaymentCtas/contributionPaymentCtas';
import {
  getAmount,
} from 'components/contributionSelection/contributionSelectionReducer';
import {
  payPalContributionButtonActionsFor,
} from 'components/paymentButtons/payPalContributionButton/payPalContributionButtonActions';

import type { State } from '../contributionsLandingUKReducer';


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    contributionType: state.page.selection.contributionType,
    amount: getAmount(state.page.selection),
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    country: state.common.country,
    currency: state.common.currency,
    isDisabled: !!state.page.selection.error,
    error: state.page.payPal.error,
  };

}

const mapDispatchToProps = {
  resetError: payPalContributionButtonActionsFor('CONTRIBUTE_SECTION').resetError,
};


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(ContributionPaymentCtas);
