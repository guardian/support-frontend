// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import PayPalContributionButton from 'containerisableComponents/payPalContributionButton/payPalContributionButton';
import { payPalContributionButtonActionsFor } from 'containerisableComponents/payPalContributionButton/payPalContributionButtonActions';
import { getAmount } from 'containerisableComponents/contributionSelection/contributionSelectionReducer';

import type { State } from '../contributionsLandingReducer';


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    amount: getAmount(state.page.selection),
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    countryGroupId: state.common.countryGroup,
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
