// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { type Option } from 'helpers/types/option';

import './label.scss';

// ----- Types ----- //
export type PropsForHoc = {
  label: string,
  optional?: boolean,
  footer?: Node,
};

type Props = PropsForHoc & {
  htmlFor: Option<string>,
  children: Node,
};

// ----- Component ----- //

function Label({
  label, children, footer, htmlFor, optional,
}: Props) {
  const Element = htmlFor ? 'label' : 'strong';
  return (
    <div className="component-form-label">
      <Element className="component-form-label__label" htmlFor={htmlFor}>
        {label}
        {optional && <span className="component-form-label__note">optional</span>}
      </Element>
      {children}
      {footer && <div className="component-form-label__footer">{footer}</div>}
    </div>
  );
}
Label.defaultProps = {
  footer: null,
  optional: false,
};

// ----- Exports ----- //

export { Label };
