// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import PaymentMethods from 'components/paymentMethods/paymentMethods';

// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    email: state.page.user.email,
    error: state.page.monthlyContrib.error,
    hide: state.page.user.firstName === '' || state.page.user.lastName === '',
    paymentStatus: state.page.monthlyContrib.paymentStatus,
  };

}

// ----- Exports ----- //

export default connect(mapStateToProps)(PaymentMethods);
