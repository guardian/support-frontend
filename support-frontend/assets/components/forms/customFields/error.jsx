// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { type Option } from 'helpers/types/option';

import './error.scss';
import { InlineError } from '@guardian/src-inline-error';

// ----- Types ----- //
export type PropsForHoc = {
  error: Option<string> | Option<Node>,
};

type Props = PropsForHoc & {
  children?: Option<Node>,
};

// ----- Component ----- //

function Error({ error, children }: Props) {
  return (
    <div className={error ? 'component-form-error' : null}>
      {error && <InlineError>{error}</InlineError>}
      {children}
    </div>
  );
}

// ----- Exports ----- //

export { Error };
