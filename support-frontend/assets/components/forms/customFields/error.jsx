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
  children?: Option<Node>,
};

// ----- Component ----- //

function Error({ error, htmlFor, children }: Props) {
  const Element = htmlFor ? 'label' : 'div';
  return (
    <div className={error ? 'component-form-error' : null}>
      {children && children}
      <Element
        aria-hidden={!error}
        aria-atomic="true"
        aria-live="polite"
        htmlFor={htmlFor}
        className="component-form-error__error"
      >
        {error}
      </Element>
    </div>
  );
}

Error.defaultProps = {
  children: null,
};

// ----- Exports ----- //

export { Error };
