// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { type Option } from 'helpers/types/option';

// ----- Types ----- //
export type PropsForHoc = {
  error: Option<string>,
  valid: Option<string>,
};

type Props = PropsForHoc & {
  htmlFor: Option<string>,
  children?: Option<Node>,
};

// ----- Component ----- //

const getClassName = (error: Option<string>, valid: Option<string>) => {
  if (error) {
    return 'component-form-error';
  } else if (valid) {
    return 'component-form-valid';
  }
  return null;
};

function Validated({
  error,
  valid,
  htmlFor,
  children,
}: Props) {
  const Element = htmlFor ? 'label' : 'div';

  return (
    <div className={getClassName(error, valid)}>
      <Element
        aria-hidden={!valid}
        aria-atomic="true"
        aria-live="polite"
        htmlFor={htmlFor}
        className="component-form-valid__valid"
      >
        {valid}
      </Element>
      {children && children}
    </div>
  );
}

// ----- Exports ----- //

export { Validated };
