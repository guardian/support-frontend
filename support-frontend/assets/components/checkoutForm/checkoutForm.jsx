// @flow

import React, { type Node, type Element, type ChildrenArray } from 'react';
import { type Option } from 'helpers/types/option';
import Heading, { type HeadingSize } from 'components/heading/heading';

import './checkoutForm.scss';

/*
Form Section
Form "blocks". you need at least one of these.
*/

type FormSectionPropTypes = {|
  id?: string,
  title: Option<string>,
  children: Node,
  headingSize: HeadingSize,
  border: 'full' | 'bottom' | 'top' | 'none',
|};

const FormSection = ({
  children, title, headingSize, border, id,
}: FormSectionPropTypes) => (
  <div id={id} className={`component-checkout-form-section component-checkout-form-section--${border}`}>
    <div className="component-checkout-form-section__wrap">
      {title && <Heading className="component-checkout-form-section__heading" size={headingSize}>{title}</Heading>}
      {children}
    </div>
  </div>
);

FormSection.defaultProps = {
  headingSize: 2,
  title: null,
  border: 'full',
  id: '',
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
