// ----- Imports ----- //

import React from 'react';

import DoubleHeading from 'shared-components/doubleHeading';
import FeatureList from 'shared-components/featureList';


// ----- Component ----- //

export default function Bundle(props) {

    return (
      <div className="bundles__bundle">
        <DoubleHeading
          heading={props.heading}
          subheading={props.subheading}
        />
        <FeatureList listItems={props.listItems} />
      </div>
    );

}


// ----- Proptypes ----- //

Bundle.defaultProps = {
    subheading: '',
};

Bundle.propTypes = {
    heading: React.PropTypes.string.isRequired,
    subheading: React.PropTypes.string,
    listItems: React.PropTypes.arrayOf(React.PropTypes.shape({
        heading: React.PropTypes.string,
        text: React.PropTypes.string,
    })).isRequired,
};
