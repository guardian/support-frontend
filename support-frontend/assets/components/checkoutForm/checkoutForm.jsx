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
  title: Option<string>,
  children: Node,
  headingSize: HeadingSize,
  noBorder: boolean,
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

// Hidden version of form section

type FormSectionHiddenPropTypes = {|
  title: Option<string>,
  children: Node,
  headingSize: HeadingSize,
  show?: boolean,
  id?: Option<string>,
|};

const FormSectionHiddenUntilSelected = ({
  children, title, headingSize, show, id,
}: FormSectionHiddenPropTypes) => (
  <div id={id} className={show ? 'component-checkout-form-section' : 'component-checkout-form-section is-hidden'}>
    {show && (
    <div className="component-checkout-form-section__wrap">
      {title && <Heading className="component-checkout-form-section__heading" size={headingSize}>{title}</Heading>}
      {children}
    </div>)}
  </div>
);

FormSectionHiddenUntilSelected.defaultProps = {
  headingSize: 2,
  title: null,
  show: false,
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
export { FormSection, FormSectionHiddenUntilSelected };
