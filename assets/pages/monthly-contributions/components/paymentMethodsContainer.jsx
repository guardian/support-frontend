// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import PaymentMethods from 'components/paymentMethods/paymentMethods';

// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    email: state.user.email,
    error: state.monthlyContrib.error,
    hide: state.user.firstName === '' || state.user.lastName === '',
    processing: state.monthlyContrib.processing,
  };

}

// ----- Exports ----- //

export default connect(mapStateToProps)(PaymentMethods);
