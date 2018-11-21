// @flow

// ----- Imports ----- //
import { getRequestOptions } from 'helpers/fetch';
import { logPromise } from 'helpers/promise';
import { routes } from 'helpers/routes';
import { fetchJson } from 'helpers/fetch';
import { checkEmail } from 'helpers/formValidation';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import type { ContributionType } from 'helpers/contributions';

// ----- Types     ----- //
type UserType = 'new' | 'guest' | 'current';

export type UserTypeFromIdentity =
  UserType
  | 'noRequestSent'
  | 'requestPending'
  | 'requestFailed';

// ----- Functions ----- //

function sendGetUserTypeFromIdentityRequest(
  email: string,
  csrf: Csrf,
  setUserTypeFromIdentityResponse: UserTypeFromIdentity => void,
): Promise<UserTypeFromIdentity> {
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
  setUserTypeFromIdentityResponse: UserTypeFromIdentity => void,
): Promise<UserTypeFromIdentity> {

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

function canContributeWithoutSigningIn(
  contributionType: ContributionType,
  isSignedIn: boolean,
  userTypeFromIdentityResponse: UserTypeFromIdentity,
) {
  return contributionType === 'ONE_OFF'
    || isSignedIn
    || userTypeFromIdentityResponse === 'guest'
    || userTypeFromIdentityResponse === 'new';
}


export { getUserTypeFromIdentity, canContributeWithoutSigningIn };
