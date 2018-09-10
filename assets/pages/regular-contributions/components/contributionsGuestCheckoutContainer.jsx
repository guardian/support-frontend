// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { type UserFormFieldAttribute } from 'helpers/checkoutForm/checkoutForm';
import ContributionsGuestCheckout from './contributionsGuestCheckout';
import { type State } from '../regularContributionsReducer';
import { getFormFields } from '../helpers/checkoutForm/checkoutFormFieldsSelector';
import { setStage } from '../helpers/checkoutForm/checkoutFormActions';
import { type Action as CheckoutAction } from '../helpers/checkoutForm/checkoutFormActions';
import { formClassName, setShouldValidateFunctions } from './formFields';


// ----- Functions ----- //

const submitYourDetailsForm = (dispatch: Dispatch<CheckoutAction>) => {
  if (formIsValid(formClassName)) {
    dispatch(setStage('payment'));
  } else {
    setShouldValidateFunctions.forEach(f => dispatch(f()));
  }
};

// ----- State Maps ----- //

function mapStateToProps(state: State) {

  const { firstName, lastName, email } = getFormFields(state);


  return {
    amount: state.page.regularContrib.amount,
    currencyId: state.common.internationalisation.currencyId,
    country: state.common.internationalisation.countryId,
    displayName: state.page.user.displayName,
    isSignedIn: state.page.user.isSignedIn,
    stage: state.page.checkoutForm.stage,
    firstName,
    lastName,
    email,
  };
}

const mapDispatchToProps = (dispatch: Dispatch<CheckoutAction>) => ({
  onBackClick: () => {
    dispatch(setStage('checkout'));
  },
  onNextButtonClick:
    () => submitYourDetailsForm(dispatch),
});


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(ContributionsGuestCheckout);
