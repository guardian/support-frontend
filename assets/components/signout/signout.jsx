// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { signoutUrl } from 'helpers/routes';

// ---- Types ----- //

type PropTypes = {
  returnUrl?: string,
  isSignedIn: boolean,
};

// ----- Component ----- //

const Signout = (props: PropTypes) => {
  if (!props.isSignedIn) {
    return null;
  }
  return (
    <a className="component-signout" href={signoutUrl(props.returnUrl)}>
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

