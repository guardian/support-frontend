// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import PayPalContributionButton from 'containerisableComponents/payPalContributionButton/payPalContributionButton';
import { payPalContributionButtonActionsFor } from 'containerisableComponents/payPalContributionButton/payPalContributionButtonActions';
import { getAmount } from 'containerisableComponents/contributionSelection/contributionSelectionReducer';
import { inPaymentLogosTest } from 'helpers/abTests/abtest';

import type { State } from '../supportLandingReducer';


// ----- State Maps ----- //

function mapStateToProps(state: State) {
  const inLogosTest = inPaymentLogosTest(state.common.abParticipations);
  return {
    amount: getAmount(state.page.selection),
    countryGroupId: state.common.countryGroup,
    referrerAcquisitionData: state.common.referrerAcquisitionData,
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
