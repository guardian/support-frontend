// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import PayPalContributionButton from 'components/paymentButtons/payPalContributionButton/payPalContributionButton';
import {
  payPalContributionButtonActionsFor,
} from 'components/paymentButtons/payPalContributionButton/payPalContributionButtonActions';
import {
  getAmount,
} from 'components/contributionSelection/contributionSelectionReducer';

import type { State } from '../contributionsLandingUKReducer';


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    amount: getAmount(state.page.selection),
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    abParticipations: state.common.abParticipations,
    isoCountry: state.common.country,
    canClick: !state.page.selection.error,
  };

}

const mapDispatchToProps = {
  errorHandler: payPalContributionButtonActionsFor('CONTRIBUTE_SECTION').setError,
};


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(PayPalContributionButton);
