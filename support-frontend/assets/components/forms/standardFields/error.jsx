// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { type Option } from 'helpers/types/option';

import './error.scss';

// ----- Types ----- //
export type PropsForHoc = {
  error: Option<string>,
};

type Props = PropsForHoc & {
  htmlFor: Option<string>,
  children: Node,
};

// ----- Component ----- //

function Error({ error, htmlFor, children }: Props) {
  const Element = htmlFor ? 'label' : 'strong';
  return error ? (
    <div className="component-form-error">
      {children}
      <Element aria-live="polite" htmlFor={htmlFor} className="component-form-error__error">
        {error}
      </Element>
    </div>
  ) : (
    children
  );
}

// ----- Exports ----- //

export { Error };
