// @flow

// ----- Imports ----- //

import React from 'react';

import { type Option } from 'helpers/types/option';


// ----- Types ----- //

type AugmentedProps<Props> = Props & {
  error: Option<string>,
};

type In<Props> = React$ComponentType<Props>;
type Out<Props> = React$ComponentType<AugmentedProps<Props>>;


// ----- Component ----- //

function withError<Props: { id: string }>(Component: In<Props>): Out<Props> {

  return ({ error, ...props }: AugmentedProps<Props>) => (
    <div>
      <Component {...props} />
      {error ? <label className="component-error" htmlFor={props.id}>{error}</label> : null}
    </div>
  );

}


// ----- Exports ----- //

export { withError };
