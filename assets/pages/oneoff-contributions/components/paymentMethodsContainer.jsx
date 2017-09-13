// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import PaymentMethods from 'components/paymentMethods/paymentMethods';
import { checkoutError } from '../actions/oneoffContributionsActions';


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    email: state.page.user.email,
    error: state.page.oneoffContrib.error,
    hide: state.page.user.email === '' || state.page.user.fullName === '',
    paymentStatus: 'NotStarted',
    amount: state.page.oneoffContrib.amount,
    intCmp: state.common.intCmp,
    refpvid: state.common.refpvid,
    isoCountry: state.page.oneoffContrib.country,
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
