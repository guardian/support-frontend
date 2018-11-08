// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import type { Contrib, PaymentMethod } from 'helpers/contributions';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import { getForm, onFormSubmit } from 'helpers/checkoutForm/checkoutForm';
import ContributionsGuestCheckout from './contributionsGuestCheckout';
import { type State } from '../regularContributionsReducer';
import { setStage } from '../helpers/checkoutForm/checkoutFormActions';
import { type Action as CheckoutAction, setCheckoutFormHasBeenSubmitted } from '../helpers/checkoutForm/checkoutFormActions';

// ----- State Maps ----- //

function mapStateToProps(state: State) {
  return {
    amount: state.page.regularContrib.amount,
    currencyId: state.common.internationalisation.currencyId,
    country: state.common.internationalisation.countryId,
    displayName: state.page.user.displayName,
    isSignedIn: state.page.user.isSignedIn,
    stage: state.page.checkoutForm.stage,
    userTypeFromIdentityResponse: state.page.regularContrib.userTypeFromIdentityResponse,
  };
}

const mapDispatchToProps = (dispatch: Dispatch<CheckoutAction>) => ({
  onBackClick: () => {
    dispatch(setStage('checkout'));
  },

  onNextButtonClick: (
    contributionType: Contrib,
    isSignedIn: boolean,
    userTypeFromIdentityResponse: UserTypeFromIdentityResponse,
    paymentMethod: PaymentMethod,
  ) => {
    const formName = 'regular-contrib__checkout-form';
    onFormSubmit(
      paymentMethod,
      contributionType,
      getForm(formName),
      isSignedIn,
      userTypeFromIdentityResponse,
      () => {}, // we don't need this for the old flow
      () => { dispatch(setCheckoutFormHasBeenSubmitted()); },
      () => { dispatch(setStage('payment')); },
    );
  },
});

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(ContributionsGuestCheckout);
