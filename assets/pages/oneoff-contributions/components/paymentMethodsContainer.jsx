// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import PaymentMethods from 'components/paymentMethods/paymentMethods';
import { checkoutError } from '../actions/oneoffContributionsActions';


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    email: state.user.email,
    error: state.oneoffContrib.error,
    hide: state.user.email === '' || state.user.fullName === '',
    paymentStatus: 'NotStarted',
    amount: state.oneoffContrib.amount,
    intCmp: state.intCmp,
    refpvid: state.refpvid,
    isoCountry: state.oneoffContrib.country,
    payPalType: state.oneoffContrib.payPalType,
    csrfToken: state.csrf.token,
  };

}

function mapDispatchToProps(dispatch) {
  return {
    payPalErrorHandler: (message: string) => {
      dispatch(checkoutError(message));
    },
  };
}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethods);
