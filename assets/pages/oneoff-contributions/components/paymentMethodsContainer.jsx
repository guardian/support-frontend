// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import PaymentMethods from 'components/paymentMethods/paymentMethods';
import { checkoutError } from '../actions/oneoffContributionsActions';


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    email: state.page.user.email,
    error: state.page.oneOffContrib.error,
    hide: state.page.user.email === '' || state.page.user.fullName === '',
    paymentStatus: 'NotStarted',
    amount: state.page.oneOffContrib.amount,
    intCmp: state.common.intCmp,
    refpvid: state.common.refpvid,
    isoCountry: state.common.country,
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
