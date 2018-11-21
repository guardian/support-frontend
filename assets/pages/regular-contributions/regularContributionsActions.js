// @flow

// ----- Imports ----- //
import type { PaymentMethod } from 'helpers/contributions';
import type { ErrorReason } from 'helpers/errorReasons';

import type { UserTypeFromIdentity } from 'helpers/identityApis';
import { getUserTypeFromIdentity } from 'helpers/identityApis';
import type { State } from './regularContributionsReducer';


// ----- Types ----- //

export type Action =
  | { type: 'CHECKOUT_PENDING', paymentMethod: PaymentMethod }
  | { type: 'CHECKOUT_SUCCESS', paymentMethod: PaymentMethod }
  | { type: 'CHECKOUT_ERROR', errorReason: ErrorReason }
  | { type: 'SET_GUEST_ACCOUNT_CREATION_TOKEN', guestAccountCreationToken: string }
  | { type: 'SET_PAYPAL_HAS_LOADED' }
  | { type: 'CREATING_CONTRIBUTOR' }
  | { type: 'SET_USER_TYPE_FROM_IDENTITY_RESPONSE', userTypeFromIdentityResponse: UserTypeFromIdentity };

// ----- Actions ----- //

function checkoutPending(paymentMethod: PaymentMethod): Action {
  return { type: 'CHECKOUT_PENDING', paymentMethod };
}

function checkoutSuccess(paymentMethod: PaymentMethod): Action {
  return { type: 'CHECKOUT_SUCCESS', paymentMethod };
}

function checkoutError(errorReason: ErrorReason): Action {
  return { type: 'CHECKOUT_ERROR', errorReason };
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

function setUserTypeFromIdentityResponse(userTypeFromIdentityResponse: UserTypeFromIdentity): Action {
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
      (userType: UserTypeFromIdentity) => {
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
