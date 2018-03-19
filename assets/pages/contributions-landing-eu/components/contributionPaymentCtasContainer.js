// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import ContributionPaymentCtas from 'components/contributionPaymentCtas/contributionPaymentCtas';
import { getAmount } from 'containerisableComponents/contributionSelection/contributionSelectionReducer';
import { payPalContributionButtonActionsFor } from 'containerisableComponents/payPalContributionButton/payPalContributionButtonActions';

import type { State } from '../contributionsLandingEUReducer';


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
