
// @flow

// ----- Imports ----- //

import React from 'react';
import { getBaseDomain } from 'helpers/url';
import type { IdentityResponse } from '../contributionsLandingReducer';

// ---- Types ----- //

type PropTypes = {|
  returnUrl?: string,
  isSignInRequired: boolean,
  isIdentityRequestPending: boolean,
  lastIdentityResponse: IdentityResponse,
|};


// ----- Functions ----- //

// Build signout URL from given return URL or current location.
function buildUrl(returnUrl: ?string): string {

  const encodedReturn = encodeURIComponent(returnUrl || window.location);

  return `https://profile.${getBaseDomain()}/signin?returnUrl=${encodedReturn}`;

}

// ----- Component ----- //

export const MustSignIn = (props: PropTypes) => {
  if (props.isIdentityRequestPending) {
    return (
      <a className="component-signout" href={buildUrl(props.returnUrl)}>
        PENDING
      </a>
    );
  }

  if (props.lastIdentityResponse === 'failure') {
    return (
      <a className="component-signout" href={buildUrl(props.returnUrl)}>
        FAILED IDENTITY REQUEST
      </a>
    );
  }

  if (props.isSignInRequired) {
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
