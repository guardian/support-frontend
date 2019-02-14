// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import Heading, { type HeadingSize } from 'components/heading/heading';
import { classNameWithModifiers } from 'helpers/utilities';

import './text.scss';

// ---- Types ----- //

type PropTypes = {|
  title?: string | null,
  children?: ?Node,
  headingSize: HeadingSize,
|};


// ----- Render ----- //

const Text = ({
  title, children, headingSize,
}: PropTypes) => (
  <div className={
    classNameWithModifiers('component-text', [
      !children ? 'heading-only' : null,
    ])}
  >
    {title && <Heading className="component-text__heading" size={headingSize}>{title}</Heading>}
    {children}
  </div>
);

Text.defaultProps = {
  headingSize: 2,
  children: null,
  title: null,
};


// ----- Children ----- //
export const Callout = ({ children }: {children: Node}) => <p className="component-text__callout"><strong>{children}</strong></p>;
export const LargeParagraph = ({ children }: {children: Node}) => <p className="component-text__large">{children}</p>;
export const SansParagraph = ({ children }: {children: Node}) => <p className="component-text__sans">{children}</p>;


// ----- Exports ----- //

export default Text;
