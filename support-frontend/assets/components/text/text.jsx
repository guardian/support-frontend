// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import Heading, { type HeadingSize } from 'components/heading/heading';
import { classNameWithModifiers } from 'helpers/utilities';

import './text.scss';

// ---- Types ----- //

type PropTypes = {|
  title?: string | null,
  className: ?string,
  children?: ?Node,
  headingSize: HeadingSize,
|};


// ----- Render ----- //

const Text = ({
  title, children, headingSize, className,
}: PropTypes) => (
  <div className={
    [className, classNameWithModifiers('component-text', [
      !children ? 'heading-only' : null,
    ])].join(' ')}
  >
    {title && <Title size={headingSize}>{title}</Title>}
    {children}
  </div>
);

Text.defaultProps = {
  headingSize: 2,
  children: null,
  title: null,
  className: null,
};


// ----- Children ----- //
export const Title = ({ children, size }: {children: Node, size: HeadingSize}) => (
  <Heading size={size}className="component-text__heading">{children}</Heading>
);
export const Callout = ({ children }: {children: Node}) => (
  <p className="component-text__callout"><strong>{children}</strong></p>
);
export const LargeParagraph = ({ children }: {children: Node}) => (
  <p className="component-text__large">{children}</p>
);
export const SansParagraph = ({ children }: {children: Node}) => (
  <p className="component-text__sans">{children}</p>
);


// ----- Exports ----- //

export default Text;
