// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { type Option } from 'helpers/types/option';
import { InlineError } from '@guardian/src-inline-error';

import './error.scss';

// ----- Types ----- //
export type PropsForHoc = {
  error: Option<string> | Option<Node>,
};

type Props = PropsForHoc & {
  children?: Option<Node>,
};

// ----- Component ----- //

function Error({ error, children }: Props) {
  const errorNode = error === 'Temporary COVID message' ? (
    <div className="component-form-error__summary-error">
      The address and postcode you entered is outside of our delivery area. You may want to
      consider purchasing a <a href="/uk/subscribe/paper">voucher subscription</a>
    </div>) : (
      <InlineError>
        {error}
      </InlineError>);

  return (
    <div className={error ? 'component-form-error' : null}>
      {error && errorNode}
      {children && children}
    </div>
  );
}

// ----- Exports ----- //

export { Error };
