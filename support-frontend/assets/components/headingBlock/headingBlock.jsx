// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { type Option } from 'helpers/types/option';

import './headingBlock.scss';


// ----- Types ----- //

type PropTypes = {|
  overheading: Option<string>,
  children?: Node,
|};


// ----- Component ----- //

function HeadingBlock(props: PropTypes) {

  return (
    <div className="component-heading-block">
      <div className="component-heading-block__content">
        {props.overheading ?
        [
          (
            <h1 className="component-heading-block__overheading">{props.overheading}</h1>),
          (
            <div className="component-heading-block__heading">
              <h2 className="component-heading-block__maxwidth">{props.children}</h2>
            </div>
           ),
         ]
        :
        <div className="component-heading-block__heading">
          <h1 className="component-heading-block__maxwidth">{props.children}</h1>
        </div>
      }
      </div>
    </div>
  );

}


HeadingBlock.defaultProps = {
  children: null,
  overheading: null,
};


// ----- Export ----- //

export default HeadingBlock;
