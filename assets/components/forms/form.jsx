// @flow

import React, { type Node } from 'react';
import { type Option } from 'helpers/types/option';
import Heading, { type HeadingSize } from 'components/heading/heading';

import './form.scss';

type FormSectionPropTypes = {|
  title: Option<string>,
  children: Node,
  headingSize: HeadingSize,
|};

const Form = ({ children }: {children: Node}) => (<div className="component-form">{children}</div>);

const FormSection = ({ children, title, headingSize }: FormSectionPropTypes) => (
  <div className="component-form-section">
    {title && <Heading className="component-form-section__heading" size={headingSize}>{title}</Heading>}
    {children}
  </div>
);
FormSection.defaultProps = {
  headingSize: 2,
  title: null,
};

export { FormSection, Form };

