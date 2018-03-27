// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { getBaseDomain } from 'helpers/url';

// ---- Types ----- //

type PropTypes = {
  returnUrl?: string,
  isSignedIn: boolean
};


// ----- Functions ----- //

// Build signout URL from given return URL or current location.
function buildUrl(returnUrl: ?string): string {

  const encodedReturn = encodeURIComponent(returnUrl || window.location);

  return `https://profile.${getBaseDomain()}/signout?returnUrl=${encodedReturn}`;

}

// ----- Component ----- //

const Signout = (props: PropTypes) => {
  if (!props.isSignedIn) {
    return null;
  }
  return (
    <a className="component-signout" href={buildUrl(props.returnUrl)}>
      Not you? Sign out
    </a>
  );
};


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    isSignedIn: state.page.user.isSignedIn,
  };

}


// ----- Default Props ----- //

Signout.defaultProps = {
  returnUrl: '',
};


// ----- Exports ----- //

export default connect(mapStateToProps)(Signout);

