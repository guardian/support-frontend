// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';


// ----- Types ----- //

type PropTypes = {
  heading: string,
  children: Node,
};


// ----- Component ----- //

function HeadingBlock(props: PropTypes) {

  return (
    <div className="component-heading-block">
      <h1 className="component-heading-block__heading">{props.heading}</h1>
      <div className="component-heading-block__banner">
        {props.children}
      </div>
    </div>
  );

}


// ----- Export ----- //

export default HeadingBlock;
