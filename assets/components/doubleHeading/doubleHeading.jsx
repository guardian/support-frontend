// @flow

// ----- Imports ----- //

import React from 'react';


// ---- Types ----- //

type PropTypes = {
  heading: string,
  subheading: ?string,
};


// ----- Component ----- //

export default function DoubleHeading(props: PropTypes) {

  const subhead = (
    <h2 className="component-double-heading__subheading">
      { props.subheading }
    </h2>
  );

  return (
    <div className="component-double-heading">
      <h1 className="component-double-heading__heading">
        { props.heading }
      </h1>
      { props.subheading ? subhead : '' }
    </div>
  );

}


// ----- Proptypes ----- //

DoubleHeading.defaultProps = {
  subheading: '',
};
