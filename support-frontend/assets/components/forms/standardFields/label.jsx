// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { type Option } from 'helpers/types/option';

import './label.scss';


// ----- Types ----- //
export type PropsForHoc = {
  label: string,
  footer?: Node
}

type Props = PropsForHoc & {
  htmlFor: Option<string>,
  children: Node,
};

// ----- Component ----- //

function Label({
  label, children, footer, htmlFor,
}: Props) {
  const Element = htmlFor ? 'label' : 'strong';
  return (
    <div className="component-form-label">
      <Element className="component-form-label__label" htmlFor={htmlFor}>{label}</Element>
      {children}
      {footer &&
        <div className="component-form-label__footer">{footer}</div>
      }
    </div>);
}
Label.defaultProps = {
  footer: null,
};


// ----- Exports ----- //

export { Label };
