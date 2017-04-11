// ----- Imports ----- //

import React from 'react';


// ----- Component ----- //

export default function CtaLink(props) {

    return (
      <a className="component-cta-link" href={props.url}>
        {props.text}
      </a>
    );

}


// ----- Proptypes ----- //

CtaLink.propTypes = {
    text: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired,
};
