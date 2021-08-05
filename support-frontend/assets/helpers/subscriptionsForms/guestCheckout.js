// @flow

import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { getUserTypeFromIdentity } from 'helpers/identityApis';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import { setUserTypeFromIdentityResponse } from 'helpers/subscriptionsForms/formActions';

export const checkIfEmailHasPassword = (email: string) =>
  (dispatch: Function, getState: () => CheckoutState): void => {
    const state = getState();
    const { csrf } = state.page;
    const { isSignedIn } = state.page.checkout;

    getUserTypeFromIdentity(
      email,
      isSignedIn,
      csrf,
      (userType: UserTypeFromIdentityResponse) =>
        dispatch(setUserTypeFromIdentityResponse(userType)),
    );
  };
