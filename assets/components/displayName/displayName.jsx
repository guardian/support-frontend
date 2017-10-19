// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { SvgUser } from 'components/svg/svg';


// ---- Types ----- //

type PropTypes = {
  name: string,
};


// ----- Component ----- //

function DisplayName(props: PropTypes) {

  return (
    <div className="component-display-name">
      <SvgUser />
      <span className="component-display-name__name">{props.name}</span>
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
