// @flow

// ----- Imports ----- //

import React from 'react';

import { getBaseDomain } from 'helpers/url';


// ---- Types ----- //

type PropTypes = {
  returnUrl?: string,
};


// ----- Functions ----- //

// Build signout URL from given return URL or current location.
function buildUrl(returnUrl: ?string): string {

  const encodedReturn = encodeURIComponent(returnUrl || window.location);

  return `https://profile.${getBaseDomain()}/signout?returnUrl=${encodedReturn}`;

}


// ----- Component ----- //

export default function Signout(props: PropTypes) {

  return (
    <a className="component-signout" href={buildUrl(props.returnUrl)}>
      Not you? Sign out
    </a>
  );

}


// ----- Default Props ----- //

Signout.defaultProps = {
  returnUrl: '',
};
