// @flow

// ----- Imports ----- //

import React from 'react';

import { Error, type PropsForHoc } from 'components/forms/customFields/error';

// ----- Types ----- //

type AugmentedProps<Props> = Props & PropsForHoc;

type In<Props> = React$ComponentType<Props>;
type Out<Props> = React$ComponentType<AugmentedProps<Props>>;


// ----- Component ----- //

function withError<Props: { id: string }>(Component: In<Props>): Out<Props> {

  return ({ error, ...props }: AugmentedProps<Props>) => (
    <Error htmlFor={props.id} error={error}>
      <Component {...props} />
    </Error>
  );

}


// ----- Exports ----- //

export { withError };
