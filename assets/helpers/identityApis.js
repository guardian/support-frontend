// @flow


// ----- Imports ----- //
import { getRequestOptions } from 'helpers/fetch';
import { logPromise } from 'helpers/promise';
import { routes } from 'helpers/routes';
import { fetchJson } from 'helpers/fetch';
import { checkEmail } from 'helpers/formValidation';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import {
  type UserTypeFromIdentityResponse,
  type UserType,
} from '../pages/new-contributions-landing/contributionsLandingReducer';

// ----- Functions ----- //

function sendGetUserTypeFromIdentityRequest(
  email: string,
  csrf: Csrf,
  setUserTypeFromIdentityResponse: UserTypeFromIdentityResponse => void,
): Promise<UserTypeFromIdentityResponse> {
  return fetchJson(
    `${routes.getUserType}?maybeEmail=${encodeURIComponent(email)}`,
    getRequestOptions('same-origin', csrf),
  ).then((resp: { userType: UserType }) => {
    if (typeof resp.userType !== 'string') {
      throw new Error('userType string was not present in response');
    }
    setUserTypeFromIdentityResponse(resp.userType);
    return resp.userType;
  });
}

function getUserTypeFromIdentity(
  email: string,
  isSignedIn: boolean,
  csrf: Csrf,
  setUserTypeFromIdentityResponse: UserTypeFromIdentityResponse => void,
): Promise<UserTypeFromIdentityResponse> {

  if (isSignedIn || !checkEmail(email)) {
    setUserTypeFromIdentityResponse('noRequestSent');
    return Promise.resolve('noRequestSent');
  }

  setUserTypeFromIdentityResponse('requestPending');

  return logPromise(sendGetUserTypeFromIdentityRequest(email, csrf, setUserTypeFromIdentityResponse))
    .catch(() => {
      setUserTypeFromIdentityResponse('requestFailed');
      return 'requestFailed';
    });
}

export { getUserTypeFromIdentity };
