// @flow

// ----- Imports ----- //

import React from 'react';
import SvgUser from 'components/svgs/user';


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


// ----- Exports ----- //

export default DisplayName;
