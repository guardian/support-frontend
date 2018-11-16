// @flow
import type { Contrib, PaymentMethod } from 'helpers/contributions';
import { canContributeWithoutSigningIn } from 'helpers/identityApis';
import { formElementIsValid, invalidReason } from 'helpers/checkoutForm/checkoutForm';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import { trackCheckoutSubmitAttempt } from 'helpers/tracking/ophanComponentEventTracking';

type OldFlowOrNewFlow = 'opf' | 'npf';

export type FormSubmitParameters = {
  flowPrefix: OldFlowOrNewFlow,
  paymentMethod: PaymentMethod,
  contributionType: Contrib,
  form: Object | null,
  isSignedIn: boolean,
  userTypeFromIdentityResponse: UserTypeFromIdentityResponse,
  setFormIsValid: boolean => void,
  setCheckoutFormHasBeenSubmitted: () => void,
  handlePayment?: () => void,
  isRecurringContributor: boolean,
}

export const onFormSubmit = (params: FormSubmitParameters) => {
  const componentId = `${params.paymentMethod}-${params.contributionType}-submit`;
  const formIsValid = formElementIsValid(params.form);
  const userType = params.isSignedIn ? 'signed-in' : params.userTypeFromIdentityResponse;
  const canContribute =
    !params.isRecurringContributor && canContributeWithoutSigningIn(params.contributionType, params.isSignedIn, params.userTypeFromIdentityResponse);
  if (formIsValid) {
    params.setFormIsValid(true);
    if (canContribute) {
      // For PayPal, we handle the payment elsewhere
      if (params.handlePayment) {
        params.handlePayment();
      }
      trackCheckoutSubmitAttempt(componentId, `${params.flowPrefix}-allowed-for-user-type-${userType}`);
    } else {
      trackCheckoutSubmitAttempt(componentId, `${params.flowPrefix}-blocked-because-user-type-is-${userType}`);
    }
  } else {
    params.setFormIsValid(false);
    trackCheckoutSubmitAttempt(componentId, `${params.flowPrefix}-blocked-because-form-not-valid${invalidReason(params.form)}`);
  }
  params.setCheckoutFormHasBeenSubmitted();
};
