// @flow

import React, { type Node, type Element, type ChildrenArray, type Boolean } from 'react';
import { type Option } from 'helpers/types/option';
import Heading, { type HeadingSize } from 'components/heading/heading';

import './checkoutForm.scss';

/*
Form Section
Form "blocks". you need at least one of these.
*/

type FormSectionPropTypes = {|
  title: Option<string>,
  children: Node,
  headingSize: HeadingSize,
  noBorder: Boolean,
|};

const FormSection = ({
  children, title, headingSize, noBorder,
}: FormSectionPropTypes) => (
  <div className={`component-checkout-form-section ${noBorder ? 'component-checkout-form-section--no-border' : ''}`}>
    <div className="component-checkout-form-section__wrap">
      {title && <Heading className="component-checkout-form-section__heading" size={headingSize}>{title}</Heading>}
      {children}
    </div>
  </div>
);

FormSection.defaultProps = {
  headingSize: 2,
  title: null,
  noBorder: false,
};

/*
Form
the top level form itself
*/

type FormPropTypes = {
  children: ChildrenArray<Element<any> | null>,
};
const Form = ({ children, ...otherProps }: FormPropTypes) => (<form {...otherProps} className="component-checkout-form">{children}</form>);

export default Form;
export { FormSection };

