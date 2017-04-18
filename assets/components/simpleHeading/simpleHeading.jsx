// ----- Imports ----- //

import React from 'react';


// ----- Component ----- //

const SimpleHeading = props => (
  <div className="component-simple-heading">
    <h1 className="component-simple-heading__heading">
      { props.heading }
    </h1>
  </div>
);

// ----- Proptypes ----- //

SimpleHeading.propTypes = {
  heading: React.PropTypes.string.isRequired,
};

// ----- Exports ----- //

export default SimpleHeading;
