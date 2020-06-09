// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { type Option } from 'helpers/types/option';

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
  return (
    <div className={error ? 'component-form-error' : null}>
      {error && error}
      {children && children}
    </div>
  );
}

// ----- Exports ----- //

export { Error };
