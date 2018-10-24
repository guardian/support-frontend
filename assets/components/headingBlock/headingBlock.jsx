// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';


// ----- Types ----- //

type PropTypes = {|
  heading: string,
  children: Node,
|};


// ----- Component ----- //

function HeadingBlock(props: PropTypes) {

  return (
    <div className="component-heading-block">
      <LeftMarginSection>
        <div className="component-heading-block__content">
          <h1 className="component-heading-block__heading">{props.heading}</h1>
          <div className="component-heading-block__banner">
            {props.children}
          </div>
        </div>
      </LeftMarginSection>
    </div>
  );

}


// ----- Export ----- //

export default HeadingBlock;
