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
      {children && children}
      <Element
        aria-hidden={!error}
        aria-atomic="true"
        aria-live="polite"
        htmlFor={htmlFor}
        className="component-form-error__error"
      >
        {(error === 'Temporary COVID message') && (
          <li className="component-form-error__summary-error">
            The address and postcode you entered is outside of our delivery area. You may want to
            consider purchasing a <a href="/uk/subscribe/paper">voucher subscription</a>
          </li>)
        }
        {(error !== 'Temporary COVID message') && error}
      </Element>
      <Element
        aria-hidden={!valid}
        aria-atomic="true"
        aria-live="polite"
        htmlFor={htmlFor}
        className="component-form-valid__valid"
      >
        {valid}
      </Element>
    </div>
  );
}

// ----- Exports ----- //

export { Validated };
