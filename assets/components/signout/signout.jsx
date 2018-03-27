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

function Signout(props: PropTypes) {
  if (props.isSignedIn) {
    return (
      <a className="component-signout" href={buildUrl(props.returnUrl)}>
        Not you? Sign out
      </a>
    );
  }
}

// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    email: state.page.user.email,
    isSignedIn: state.page.user.isSignedIn,
  };

}
// ----- Component ----- //

export default connect(mapStateToProps)(Signout);


// ----- Default Props ----- //

Signout.defaultProps = {
  returnUrl: '',
  email: null,
};
