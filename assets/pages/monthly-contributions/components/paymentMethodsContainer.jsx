// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import PaymentMethods from 'components/paymentMethods/paymentMethods';


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    email: state.user.email,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    error: state.monthlyContrib.error,
  };

}

// ----- Exports ----- //

export default connect(mapStateToProps)(PaymentMethods);
