// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import Contribute from 'components/contribute/contribute';
import { getPaymentLogosTestVariant } from 'helpers/abTests/abtest';
import type { State } from '../supportLandingReducer';


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    contributionType: state.page.selection.contributionType,
    paymentLogosVariant: getPaymentLogosTestVariant(state.common.abParticipations),
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(Contribute);
