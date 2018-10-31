
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
  isSignedIn: boolean,
  userTypeFromIdentityResponse: UserTypeFromIdentityResponse,
  contributionType: Contrib,
  checkoutFormHasBeenSubmitted: boolean,
|};


// ----- Functions ----- //

// Build signout URL from given return URL or current location.
function buildUrl(): string {

  const encodedReturn = encodeURIComponent(window.location);

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
        <div className={classNameWithModifiers('component-error-message', ['sign-in'])}>
          <AnimatedDots />
        </div>
      );
    case 'requestFailed':
      return (
        <div className={classNameWithModifiers('component-error-message', ['sign-in'])}>
          There was an unexpected error. Please refresh the page and try again.
        </div>
      );

    case 'current':
      return (
        <a href={buildUrl()}>
          <div className={classNameWithModifiers('component-error-message', ['sign-in'])}>
            <div>
              You already have a Guardian account.
              Please <span className="underline">sign in</span> or use another email address.
            </div>
          </div>
        </a>
      );

    default:
      return null;
  }

};
