// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import Svg from 'components/svg/svg';
import Signout from 'components/signout/signout';


// ---- Types ----- //

type PropTypes = {
  name: string,
};


// ----- Component ----- //

function DisplayName(props: PropTypes) {

  return (
    <div className="component-display-name">
      <Svg svgName="user" />
      <span className="component-display-name__name">{props.name}</span>
      <Signout />
    </div>
  );

}


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    name: state.page.user.displayName,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(DisplayName);
