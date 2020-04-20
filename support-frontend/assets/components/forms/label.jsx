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
  id?: string,
};

type Props = PropsForHoc & {
  htmlFor: Option<string>,
  children: Node,
};

// ----- Component ----- //

function Label({
  label, children, footer, htmlFor, optional, id,
}: Props) {
  const Element = htmlFor ? 'label' : 'strong';
  return (
    <div className="component-form-label">
      <Element className="component-form-label__label" id={id} htmlFor={htmlFor}>
        {label}
        {optional && <span className="component-form-label__note">Optional</span>}
      </Element>
      {children}
      {footer && <div className="component-form-label__footer">{footer}</div>}
    </div>
  );
}
Label.defaultProps = {
  footer: null,
  optional: false,
  id: null,
};

// ----- Exports ----- //

export { Label };
