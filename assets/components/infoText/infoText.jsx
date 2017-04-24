// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Types ----- //

type PropTypes = {
  text: string,
};


// ----- Component ----- //

export default function InfoText(props: PropTypes) {
  return <p className="component-info-text">{ props.text }</p>;
}
