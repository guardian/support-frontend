// @flow

// ----- Imports ----- //

import React from 'react';


// ---- Types ----- //

type PropTypes = {
  copy: string[],
};


// ----- Component ----- //

export default function BodyCopy(props: PropTypes) {

  return (
    <div className="component-body-copy">
      {props.copy.map(para =>
        <p className="component-body-copy__para">{para}</p>)}
    </div>
  );

}
