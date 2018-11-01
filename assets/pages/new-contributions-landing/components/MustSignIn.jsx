
// @flow

// ----- Imports ----- //

import type { Contrib } from 'helpers/contributions';
import React from 'react';
import { getBaseDomain } from 'helpers/url';
import { canContributeWithoutSigningIn, type UserTypeFromIdentityResponse } from 'helpers/identityApis';
import AnimatedDots from 'components/spinners/animatedDots';
import { classNameWithModifiers } from 'helpers/utilities';
import { trackMustSignInClick } from 'helpers/tracking/ophanComponentEventTracking';

// ---- Types ----- //

type PropTypes = {|
  isSignedIn: boolean,
  userTypeFromIdentityResponse: UserTypeFromIdentityResponse,
  contributionType: Contrib,
  checkoutFormHasBeenSubmitted: boolean,
  email: string,
|};


// ----- Functions ----- //

// Build signout URL from given return URL or current location.
function buildUrl(email: string): string {
  const encodedReturn = encodeURIComponent(window.location);
  const encodedEmail = encodeURIComponent(email);

  return `https://profile.${getBaseDomain()}/signin/current?returnUrl=${encodedReturn}&email=${encodedEmail}`;

}

// ----- Component ----- //

export const MustSignIn = (props: PropTypes) => {

  const signInUrl = buildUrl(props.email);

  const onClick = (event) => {
    event.preventDefault();
    trackMustSignInClick();
    window.location.assign(signInUrl);
  };

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
        <a className={classNameWithModifiers('form__error', ['sign-in'])} href={signInUrl} onClick={onClick}>
            You already have a Guardian account. Please <span className="underline">sign in</span> or use another email address.
        </a>
      );

    default:
      return null;
  }

};
