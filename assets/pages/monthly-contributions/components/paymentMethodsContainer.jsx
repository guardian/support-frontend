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
    paymentStatus: state.monthlyContrib.paymentStatus,
    amount: state.monthlyContrib.amount,
    payPalType: state.monthlyContrib.payPalType,
    csrfToken: state.csrf.token,
  };

}

// ----- Exports ----- //

export default connect(mapStateToProps)(PaymentMethods);
