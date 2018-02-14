// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import Contribute from 'components/contribute/contribute';
import {
  payPalContributionButtonActionsFor,
} from 'components/paymentButtons/payPalContributionButton/payPalContributionButtonActions';

import type { State } from '../supportLandingReducer';


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    error: state.page.payPal.error,
  };

}

const mapDispatchToProps = {
  closeError: payPalContributionButtonActionsFor('CONTRIBUTE_SECTION').resetError,
};


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(Contribute);
