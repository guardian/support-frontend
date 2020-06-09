// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { type Option } from 'helpers/types/option';

// ----- Types ----- //
export type PropsForHoc = {
  valid: Option<string>,
};

type Props = PropsForHoc & {
  htmlFor: Option<string>,
  children?: Option<Node>,
};

// ----- Component ----- //

function Validated({
  valid,
  htmlFor,
  children,
}: Props) {
  const Element = htmlFor ? 'label' : 'div';

  return (
    <div className={valid ? 'component-form-valid' : null}>
      <Element
        aria-hidden={!valid}
        aria-atomic="true"
        aria-live="polite"
        htmlFor={htmlFor}
        className="component-form-valid__valid"
      >
        {valid}
      </Element>
      {children}
    </div>
  );
}

// ----- Exports ----- //

export { Validated };
