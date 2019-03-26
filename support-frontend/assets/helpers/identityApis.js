// @flow

// ----- Imports ----- //
import { getRequestOptions } from 'helpers/fetch';
import { logPromise } from 'helpers/promise';
import { routes } from 'helpers/routes';
import { fetchJson } from 'helpers/fetch';
import { checkEmail } from 'helpers/formValidation';
import type { ContributionType } from 'helpers/contributions';

// ----- Types     ----- //
type UserType = 'new' | 'guest' | 'current';

export type UserTypeFromIdentityResponse =
  UserType
  | 'noRequestSent'
  | 'requestPending'
  | 'requestFailed';

export type IdUserFromIdentity = ?{
  id: string,
  primaryEmailAddress: string,
  publicFields: ?{
    displayName: ?string,
  },
  privateFields: ?{
    firstName: ?string,
    secondName: ?string,
  },
}

// ----- Functions ----- //

function sendGetUserTypeFromIdentityRequest(
  email: string,
  setUserTypeFromIdentityResponse: UserTypeFromIdentityResponse => void,
): Promise<UserTypeFromIdentityResponse> {
  return fetchJson(
    `${routes.getUserType}?maybeEmail=${encodeURIComponent(email)}`,
    getRequestOptions('same-origin', null),
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
  setUserTypeFromIdentityResponse: UserTypeFromIdentityResponse => void,
): Promise<UserTypeFromIdentityResponse> {

  if (isSignedIn || !checkEmail(email)) {
    setUserTypeFromIdentityResponse('noRequestSent');
    return Promise.resolve('noRequestSent');
  }

  setUserTypeFromIdentityResponse('requestPending');

  return logPromise(sendGetUserTypeFromIdentityRequest(email, setUserTypeFromIdentityResponse))
    .catch(() => {
      setUserTypeFromIdentityResponse('requestFailed');
      return 'requestFailed';
    });
}


function sendGetUserFromIdentityRequest(): Promise<IdUserFromIdentity> {
  return fetchJson(
    routes.getUser,
    getRequestOptions('same-origin', null),
  ).then((resp: IdUserFromIdentity) => {
    return resp;
  });
}

function getUserFromIdentity(
): Promise<IdUserFromIdentity | null> {
  return logPromise(sendGetUserFromIdentityRequest())
    .catch(() => null);
}


function canContributeWithoutSigningIn(
  contributionType: ContributionType,
  isSignedIn: boolean,
  userTypeFromIdentityResponse: UserTypeFromIdentityResponse,
) {
  return contributionType === 'ONE_OFF'
    || isSignedIn
    || userTypeFromIdentityResponse === 'guest'
    || userTypeFromIdentityResponse === 'new';
}


export { getUserTypeFromIdentity, canContributeWithoutSigningIn, getUserFromIdentity };
