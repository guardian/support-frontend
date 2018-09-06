// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import PayPalContributionButton from 'components/payPalContributionButton/payPalContributionButton';
import { payPalContributionButtonActionsFor } from 'components/payPalContributionButton/payPalContributionButtonActions';
import { getAmount } from 'components/contributionSelection/contributionSelectionReducer';
import type { State } from '../contributionsLandingReducer';


// ----- State Maps ----- //

function mapStateToProps(state: State) {
  return {
    amount: getAmount(state.page.selection),
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    countryGroupId: state.common.internationalisation.countryGroupId,
    abParticipations: state.common.abParticipations,
    isoCountry: state.common.internationalisation.countryId,
    canClick: !state.page.selection.error,
    switchStatus: state.common.settings.switches.oneOffPaymentMethods.payPal,
    optimizeExperiments: state.common.optimizeExperiments,
  };

}

const mapDispatchToProps = {
  errorHandler: payPalContributionButtonActionsFor('CONTRIBUTE_SECTION').setError,
};


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(PayPalContributionButton);
