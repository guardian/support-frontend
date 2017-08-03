// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import PaymentMethods from 'components/paymentMethods/paymentMethods';

// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    email: state.user.email,
    error: state.oneoffContrib.error,
    hide: state.user.email === '' || state.user.fullName === '',
    processing: false,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(PaymentMethods);
