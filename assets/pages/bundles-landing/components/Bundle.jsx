// ----- Imports ----- //

import React from 'react';

import DoubleHeading from 'shared-components/doubleHeading';
import FeatureList from 'shared-components/featureList';
import InfoText from 'shared-components/infoText';
import CtaLink from 'shared-components/ctaLink';


// ----- Component ----- //

export default function Bundle(props) {

    return (
      <div className="bundles__bundle">
        <DoubleHeading
          heading={props.heading}
          subheading={props.subheading}
        />
        <FeatureList listItems={props.listItems} />
        {props.infoText ? <InfoText text={props.infoText} /> : ''}
        <CtaLink text={props.ctaText} url={props.ctaLink} />
      </div>
    );

}


// ----- Proptypes ----- //

Bundle.defaultProps = {
    subheading: '',
    listItems: [],
    infoText: '',
};

Bundle.propTypes = {
    heading: React.PropTypes.string.isRequired,
    subheading: React.PropTypes.string,
    listItems: React.PropTypes.arrayOf(React.PropTypes.shape({
        heading: React.PropTypes.string,
        text: React.PropTypes.string,
    })),
    infoText: React.PropTypes.string,
    ctaText: React.PropTypes.string.isRequired,
    ctaLink: React.PropTypes.string.isRequired,
};
