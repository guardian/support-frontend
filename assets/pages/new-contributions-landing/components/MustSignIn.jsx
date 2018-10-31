
// @flow

// ----- Imports ----- //

import type { Contrib } from 'helpers/contributions';
import React from 'react';
import { getBaseDomain } from 'helpers/url';
import { canContributeWithoutSigningIn, type UserTypeFromIdentityResponse } from 'helpers/identityApis';

// ---- Types ----- //

type PropTypes = {|
  returnUrl?: string,
  isSignedIn: boolean,
  userTypeFromIdentityResponse: UserTypeFromIdentityResponse,
  contributionType: Contrib,
  checkoutFormHasBeenSubmitted: boolean,
|};


// ----- Functions ----- //

// Build signout URL from given return URL or current location.
function buildUrl(returnUrl: ?string): string {

  const encodedReturn = encodeURIComponent(returnUrl || window.location);

  return `https://profile.${getBaseDomain()}/signin?returnUrl=${encodedReturn}`;

}

// ----- Component ----- //

export const MustSignIn = (props: PropTypes) => {

  if (
    canContributeWithoutSigningIn(props.contributionType, props.isSignedIn, props.userTypeFromIdentityResponse)
    || !props.checkoutFormHasBeenSubmitted
  ) {
    return null;
  }

  switch (props.userTypeFromIdentityResponse) {
    case 'requestPending':
      return (
        <a className="component-signout" href={buildUrl(props.returnUrl)}>
          PENDING
        </a>
      );

    case 'requestFailed':
      return (
        <a className="component-signout" href={buildUrl(props.returnUrl)}>
          FAILED IDENTITY REQUEST
        </a>
      );

    case 'current':
      return (
        <a className="component-signout" href={buildUrl(props.returnUrl)}>
          YOU MUST SIGN IN
        </a>
      );

    default:
      return null;
  }

};


// ----- Default Props ----- //

MustSignIn.defaultProps = {
  returnUrl: '',
};
