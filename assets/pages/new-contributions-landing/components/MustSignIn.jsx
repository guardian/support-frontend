
// @flow

// ----- Imports ----- //

import type { Contrib } from 'helpers/contributions';
import React from 'react';
import { getBaseDomain } from 'helpers/url';
import type { UserTypeFromIdentityResponse } from '../contributionsLandingReducer';

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

  if (props.contributionType === 'ONE_OFF' || !props.checkoutFormHasBeenSubmitted || props.isSignedIn) {
    return null;
  }

  if (props.userTypeFromIdentityResponse === 'requestPending') {
    return (
      <a className="component-signout" href={buildUrl(props.returnUrl)}>
        PENDING
      </a>
    );
  }

  if (props.userTypeFromIdentityResponse === 'requestFailed') {
    return (
      <a className="component-signout" href={buildUrl(props.returnUrl)}>
        FAILED IDENTITY REQUEST
      </a>
    );
  }

  if (props.userTypeFromIdentityResponse === 'current') {
    return (
      <a className="component-signout" href={buildUrl(props.returnUrl)}>
        YOU MUST SIGN IN
      </a>
    );
  }

  return null;
};


// ----- Default Props ----- //

MustSignIn.defaultProps = {
  returnUrl: '',
};
