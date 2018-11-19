// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import type { Contrib, PaymentMethod } from 'helpers/contributions';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import { getForm } from 'helpers/checkoutForm/checkoutForm';
import { type FormSubmitParameters, onFormSubmit } from 'helpers/checkoutForm/onFormSubmitOld';
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
    const form = getForm('regular-contrib__checkout-form');
    const formSubmitParameters: FormSubmitParameters = {
      flowPrefix: 'opf',
      paymentMethod,
      contributionType,
      form,
      isSignedIn,
      userTypeFromIdentityResponse,
      setCheckoutFormHasBeenSubmitted: () => {
        dispatch(setCheckoutFormHasBeenSubmitted());
      },
      handlePayment: () => {
        dispatch(setStage('payment'));
      },
      isRecurringContributor: false, // hardcoding as not needed for old flow
      setFormIsValid: () => undefined, // not needed for old fow
    };

    onFormSubmit(formSubmitParameters);
  },
});

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(ContributionsGuestCheckout);
