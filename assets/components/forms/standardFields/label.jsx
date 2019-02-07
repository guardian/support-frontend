// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import './label.scss';


// ----- Types ----- //
export type PropsForHoc = {
  label: string,
  footer?: Node
}

type Props = PropsForHoc & {
  htmlFor: string,
  children: Node,
};

// ----- Component ----- //

function Label({
  label, children, footer, htmlFor,
}: Props) {
  return (
    <div className="component-form-label">
      <label className="component-form-label__label" htmlFor={htmlFor}>{label}</label>
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
