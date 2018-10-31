// @flow

// ----- Imports ----- //
import type { PaymentMethod } from 'helpers/contributions';
import type { CheckoutFailureReason } from 'helpers/checkoutErrors';

import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import { getUserTypeFromIdentity } from 'helpers/identityApis';
import type { State } from './regularContributionsReducer';


// ----- Types ----- //

export type Action =
  | { type: 'CHECKOUT_PENDING', paymentMethod: PaymentMethod }
  | { type: 'CHECKOUT_SUCCESS', paymentMethod: PaymentMethod }
  | { type: 'CHECKOUT_ERROR', checkoutFailureReason: CheckoutFailureReason }
  | { type: 'SET_GUEST_ACCOUNT_CREATION_TOKEN', guestAccountCreationToken: string }
  | { type: 'SET_PAYPAL_HAS_LOADED' }
  | { type: 'CREATING_CONTRIBUTOR' }
  | { type: 'SET_USER_TYPE_FROM_IDENTITY_RESPONSE', userTypeFromIdentityResponse: UserTypeFromIdentityResponse };

// ----- Actions ----- //

function checkoutPending(paymentMethod: PaymentMethod): Action {
  return { type: 'CHECKOUT_PENDING', paymentMethod };
}

function checkoutSuccess(paymentMethod: PaymentMethod): Action {
  return { type: 'CHECKOUT_SUCCESS', paymentMethod };
}

function checkoutError(checkoutFailureReason: CheckoutFailureReason): Action {
  return { type: 'CHECKOUT_ERROR', checkoutFailureReason };
}

function setPayPalHasLoaded(): Action {
  return { type: 'SET_PAYPAL_HAS_LOADED' };
}

function creatingContributor(): Action {
  return { type: 'CREATING_CONTRIBUTOR' };
}

function setGuestAccountCreationToken(guestAccountCreationToken: string): Action {
  return { type: 'SET_GUEST_ACCOUNT_CREATION_TOKEN', guestAccountCreationToken };
}

function setUserTypeFromIdentityResponse(userTypeFromIdentityResponse: UserTypeFromIdentityResponse): Action {
  return { type: 'SET_USER_TYPE_FROM_IDENTITY_RESPONSE', userTypeFromIdentityResponse };
}

const checkIfEmailHasPassword = (email: string) =>
  (dispatch: Function, getState: () => State): void => {
    const state = getState();
    const { csrf } = state.page;
    const { isSignedIn } = state.page.user;

    getUserTypeFromIdentity(
      email,
      isSignedIn,
      csrf,
      (userType: UserTypeFromIdentityResponse) => {
        console.log("about to dispatch");
        dispatch(setUserTypeFromIdentityResponse(userType));
      },
    );
  };


// ----- Exports ----- //

export {
  checkoutPending,
  checkoutSuccess,
  checkoutError,
  setPayPalHasLoaded,
  creatingContributor,
  setGuestAccountCreationToken,
  checkIfEmailHasPassword,
};
