// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import type { Contrib } from 'helpers/contributions';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import { formIsValid, getForm, invalidReason } from 'helpers/checkoutForm/checkoutForm';
import { canContributeWithoutSigningIn } from 'helpers/identityApis';
import { trackCheckoutSubmitAttempt } from 'helpers/tracking/ophanComponentEventTracking';
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
  ) => {
    const canContribute =
      canContributeWithoutSigningIn(contributionType, isSignedIn, userTypeFromIdentityResponse)
      || isSignedIn;

    const componentId = `opf-${contributionType}-submit`;
    const formName = 'regular-contrib__checkout-form';
    if (formIsValid(formName)) {
      if (canContribute) {
        dispatch(setStage('payment'));
        trackCheckoutSubmitAttempt(componentId, `opf-allowed-for-user-type-${userTypeFromIdentityResponse}`);
      } else {
        trackCheckoutSubmitAttempt(componentId, `opf-blocked-because-user-type-is-${userTypeFromIdentityResponse}`);
      }
    } else {
      trackCheckoutSubmitAttempt(componentId, `opf-blocked-because-form-not-valid${invalidReason(getForm(formName))}`);
    }

    dispatch(setCheckoutFormHasBeenSubmitted());
  },
});

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(ContributionsGuestCheckout);
