
// @flow

// ----- Imports ----- //

import type { Contrib } from 'helpers/contributions';
import React from 'react';
import { getBaseDomain } from 'helpers/url';
import { canContributeWithoutSigningIn, type UserTypeFromIdentityResponse } from 'helpers/identityApis';
import AnimatedDots from 'components/spinners/animatedDots';
import { classNameWithModifiers } from 'helpers/utilities';

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
          There was an unexpected error. Please refresh the page and try again
        </div>
      );

    case 'current':
      return (
        <a className={classNameWithModifiers('form__error', ['sign-in'])} href={buildUrl(props.returnUrl)}>
            You already have a Guardian account. Please <span className="underline">sign in</span> or use another email address.
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
