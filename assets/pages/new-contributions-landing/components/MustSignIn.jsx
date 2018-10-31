
// @flow

// ----- Imports ----- //

import type { Contrib } from 'helpers/contributions';
import React from 'react';
import { getBaseDomain } from 'helpers/url';
import { canContributeWithoutSigningIn, type UserTypeFromIdentityResponse } from 'helpers/identityApis';
import ProgressMessage from 'components/progressMessage/progressMessage';
import AnimatedDots from 'components/spinners/animatedDots';

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
        <div className="form__error">
          <AnimatedDots />
        </div>
      );

    case 'requestFailed':
      return (
        <div className="form__error">
          There was an unexpected errror. Please refresh the page and try again
        </div>
      );

    case 'current':
      return (
        <div className="form__error">
          <span>You already have a Guardian account. Please </span>
          <a href={buildUrl(props.returnUrl)}>sign in</a>
          <span> or use another email address.</span>
        </div>
      );

    default:
      return null;
  }

};


// ----- Default Props ----- //

MustSignIn.defaultProps = {
  returnUrl: '',
};
