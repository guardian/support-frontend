// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import PayPalContributionButton from 'containerisableComponents/payPalContributionButton/payPalContributionButton';
import { payPalContributionButtonActionsFor } from 'containerisableComponents/payPalContributionButton/payPalContributionButtonActions';
import { getAmount } from 'containerisableComponents/contributionSelection/contributionSelectionReducer';
import { inPaymentLogosTest } from 'helpers/abTests/abtest';
import type { State } from '../contributionsLandingReducer';


// ----- State Maps ----- //

function mapStateToProps(state: State) {
  const inLogosTest = inPaymentLogosTest(state.common.abParticipations);
  return {
    amount: getAmount(state.page.selection),
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    countryGroupId: state.common.countryGroup,
    abParticipations: state.common.abParticipations,
    isoCountry: state.common.country,
    inPaymentLogosTest: inLogosTest,
    canClick: !state.page.selection.error,
  };

}

const mapDispatchToProps = {
  errorHandler: payPalContributionButtonActionsFor('CONTRIBUTE_SECTION').setError,
};


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(PayPalContributionButton);
