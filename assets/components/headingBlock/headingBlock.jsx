// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';


// ----- Types ----- //

type PropTypes = {|
  heading: string,
  overheading?: ?string,
  children: Node,
|};


// ----- Component ----- //

function HeadingBlock(props: PropTypes) {

  return (
    <div className="component-heading-block">
      <div className="component-heading-block__content">
        {props.overheading
          ?
            (
              <div>
                <h1 className="component-heading-block__overheading">{props.overheading}</h1>
                <div className="component-heading-block__heading"><h2 className="component-heading-block__maxwidth">{props.heading}</h2></div>
              </div>
             )
          :
            (<div className="component-heading-block__heading"><h1 className="component-heading-block__maxwidth">{props.heading}</h1></div>)
        }
        {props.children.length > 0 &&
            <div className="component-heading-block__banner">
              {props.children}
            </div>
          }
      </div>
    </div>
  );

}


HeadingBlock.defaultProps = {
  overheading: null,
  children: null,
};


// ----- Export ----- //

export default HeadingBlock;
