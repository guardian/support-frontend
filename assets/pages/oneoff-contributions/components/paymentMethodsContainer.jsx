// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import PaymentMethods from 'components/paymentMethods/paymentMethods';


// ----- Types ----- //

type PropTypes = {
  email: string,
  firstName: string,
  lastName: string,
  error: ?string,
  payPalButtonExists: boolean,
  stripeCallback: Function,
  payPalCallback: Function,
};


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    email: state.user.email,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    error: state.oneoffContrib.error,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(PaymentMethods);
