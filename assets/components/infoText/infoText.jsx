// ----- Imports ----- //

import React from 'react';


// ----- Component ----- //

export default function InfoText(props) {
    return <p className="component-info-text">{ props.text }</p>;
}


// ----- Proptypes ----- //

InfoText.propTypes = {
    text: React.PropTypes.string.isRequired,
};
