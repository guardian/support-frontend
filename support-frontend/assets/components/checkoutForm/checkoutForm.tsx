import type { Node, Element, ChildrenArray } from "react";
import React from "react";
import type { Option } from "helpers/types/option";
import "helpers/types/option";
import type { HeadingSize } from "components/heading/heading";
import Heading from "components/heading/heading";
import type { SerializedStyles } from "@emotion/core";
import "@emotion/core";
import "./checkoutForm.scss";

/*
Form Section
Form "blocks". you need at least one of these.
*/
type FormSectionPropTypes = {
  id?: string;
  title: Option<string>;
  children: Node;
  headingSize: HeadingSize;
  border: "full" | "bottom" | "top" | "none";
  cssOverrides?: Option<SerializedStyles>;
};

const FormSection = ({
  children,
  title,
  headingSize,
  border,
  id,
  cssOverrides
}: FormSectionPropTypes) => <div id={id} className={`component-checkout-form-section component-checkout-form-section--${border} component-checkout-form-section__wrap`} css={cssOverrides}>
    {title && <Heading className="component-checkout-form-section__heading" size={headingSize}>{title}</Heading>}
    {children}
  </div>;

FormSection.defaultProps = {
  headingSize: 2,
  title: null,
  border: 'full',
  id: '',
  cssOverrides: null
};
// Hidden version of form section
type FormSectionHiddenPropTypes = {
  title: Option<string>;
  children: Node;
  headingSize: HeadingSize;
  show?: boolean;
  id?: Option<string>;
};

const FormSectionHiddenUntilSelected = ({
  children,
  title,
  headingSize,
  show,
  id
}: FormSectionHiddenPropTypes) => <div id={id} className={show ? 'component-checkout-form-section' : 'component-checkout-form-section is-hidden'}>
    {show && <div className="component-checkout-form-section__wrap">
      {title && <Heading className="component-checkout-form-section__heading" size={headingSize}>{title}</Heading>}
      {children}
    </div>}
  </div>;

FormSectionHiddenUntilSelected.defaultProps = {
  headingSize: 2,
  title: null,
  show: false,
  id: ''
};

/*
Form
the top level form itself
*/
type FormPropTypes = {
  children: ChildrenArray<Element<any> | null>;
};

const Form = ({
  children,
  ...otherProps
}: FormPropTypes) => <form {...otherProps} className="component-checkout-form">{children}</form>;

export default Form;
export { FormSection, FormSectionHiddenUntilSelected };