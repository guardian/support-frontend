// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { SvgUser } from 'components/svg/svg';

// ---- Types ----- //

type PropTypes = {
  name: string,
  isSignedIn: boolean,
};


// ----- Component ----- //

const DisplayName = (props: PropTypes) => {
  if (!props.isSignedIn) {
    return null;
  }
  return (
    <div className="component-display-name">
      <SvgUser />
      <span className="component-display-name__name">{props.name}</span>
    </div>
  );
};


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    name: state.page.user.displayName,
    isSignedIn: state.page.user.isSignedIn,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(DisplayName);
