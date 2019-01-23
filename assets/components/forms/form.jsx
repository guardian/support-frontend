// @flow

import React, { type Node, type Element, type ChildrenArray } from 'react';
import { type Option } from 'helpers/types/option';
import Heading, { type HeadingSize } from 'components/heading/heading';

import './form.scss';

/*
Form Section
Form "blocks". you need at least one of these.
*/

type FormSectionPropTypes = {|
  title: Option<string>,
  children: Node,
  headingSize: HeadingSize,
|};

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

/*
Form
the top level form itself
*/

type FormPropTypes = {
  children: ChildrenArray<Element<typeof FormSection>>,
};
const Form = ({ children, ...otherProps }: FormPropTypes) => (<form {...otherProps} className="component-form">{children}</form>);

export default Form;
export { FormSection };

