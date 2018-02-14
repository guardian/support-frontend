// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import PayPalContributionButton from 'components/paymentButtons/payPalContributionButton/payPalContributionButton';

import type { State } from '../contributionsLandingUKReducer';


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    error: state.page.payPal.error,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(PayPalContributionButton);
