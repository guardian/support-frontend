// @flow
import type { Contrib, PaymentMethod } from 'helpers/contributions';
import { invalidReason } from 'helpers/checkoutForm/checkoutForm';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import { trackCheckoutSubmitAttempt } from 'helpers/tracking/ophanComponentEventTracking';

type OldFlowOrNewFlow = 'opf' | 'npf';

export type FormSubmitParameters = {
  flowPrefix: OldFlowOrNewFlow,
  paymentMethod: PaymentMethod,
  contributionType: Contrib,
  isSignedIn: boolean,
  userTypeFromIdentityResponse: UserTypeFromIdentityResponse,
  setCheckoutFormHasBeenSubmitted: () => void,
  handlePayment?: () => void,
  formIsSubmittable: boolean,
  formIsValid: boolean,
  form: Object | null,
}

export const onFormSubmit = (params: FormSubmitParameters) => {
  const componentId = `${params.paymentMethod}-${params.contributionType}-submit`;
  const userType = params.isSignedIn ? 'signed-in' : params.userTypeFromIdentityResponse;
  if (params.formIsValid) {
    if (params.formIsSubmittable) {
      // For PayPal, we handle the payment elsewhere
      if (params.handlePayment) {
        params.handlePayment();
      }
      trackCheckoutSubmitAttempt(componentId, `${params.flowPrefix}-allowed-for-user-type-${userType}`);
    } else {
      trackCheckoutSubmitAttempt(componentId, `${params.flowPrefix}-blocked-because-user-type-is-${userType}`);
    }
  } else {
    trackCheckoutSubmitAttempt(componentId, `${params.flowPrefix}-blocked-because-form-not-valid${invalidReason(params.form)}`);
  }
  params.setCheckoutFormHasBeenSubmitted();
};
