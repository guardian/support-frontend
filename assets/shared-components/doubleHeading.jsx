// ----- Imports ----- //

import React from 'react';


// ----- Component ----- //

export default function DoubleHeading(props) {

    const subhead = (
      <h2 className="component-double-heading__sub-heading">
        { props.subheading }
      </h2>
    );

    return (
      <div className="component-double-heading">
        <h1 className="component-double-heading__main-heading">
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

DoubleHeading.propTypes = {
    heading: React.PropTypes.string.isRequired,
    subheading: React.PropTypes.string,
};
