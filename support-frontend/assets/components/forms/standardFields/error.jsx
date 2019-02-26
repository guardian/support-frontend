// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { type Option } from 'helpers/types/option';

import './error.scss';


// ----- Types ----- //
export type PropsForHoc = {
  error: Option<string>,
}

type Props = PropsForHoc & {
  htmlFor: string,
  children: Node,
};

// ----- Component ----- //

function Error({
  error, htmlFor, children,
}: Props) {
  return error ? (
    <div className="component-form-error">
      {children}
      <label htmlFor={htmlFor} className="component-form-error__error">{error}</label>
    </div>) : children;
}


// ----- Exports ----- //

export { Error };
