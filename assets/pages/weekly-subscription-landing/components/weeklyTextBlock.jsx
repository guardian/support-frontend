// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import Heading, { type HeadingSize } from 'components/heading/heading';


// ---- Types ----- //

type PropTypes = {|
  title: string, children?: ?Node, headingSize: HeadingSize,
|};


// ----- Render ----- //

const WeeklyTextBlock = ({ title, children, headingSize }: PropTypes) => (
  <div className="weekly-text-block">
    <Heading className="weekly-text-block__heading" size={headingSize}>{title}</Heading>
    {children}
  </div>
);

WeeklyTextBlock.defaultProps = {
  headingSize: 2,
  children: null,
};

export default WeeklyTextBlock;
