// @flow

// ----- Imports ----- //

import React from 'react';


// ---- Types ----- //

type PropTypes = {
  heading: string,
};


// ----- Component ----- //

const SimpleHeading = (props: PropTypes) => (
  <div className="component-simple-heading">
    <h1 className="component-simple-heading__heading">
      { props.heading }
    </h1>
  </div>
);


// ----- Exports ----- //

export default SimpleHeading;
