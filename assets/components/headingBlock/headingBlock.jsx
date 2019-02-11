// @flow

// ----- Imports ----- //

import React, { type Node, Children } from 'react';

import './headingBlock.scss';


// ----- Types ----- //

type PropTypes = {|
  overheading: string,
  heading: string,
  children?: Node,
|};


// ----- Component ----- //

function HeadingBlock(props: PropTypes) {

  return (
    <div className="component-heading-block">
      <div className="component-heading-block__content">
        <h1 className="component-heading-block__overheading">{props.overheading}</h1>
        <div className="component-heading-block__heading">
          <h2 className="component-heading-block__maxwidth">{props.heading}</h2>
        </div>
        {Children.count(props.children) > 0 &&
        <div className="component-heading-block__banner">
          {props.children}
        </div>
        }
      </div>
    </div>
  );

}


HeadingBlock.defaultProps = {
  children: null,
};


// ----- Export ----- //

export default HeadingBlock;
