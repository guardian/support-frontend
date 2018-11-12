// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Types ----- //

type AugmentedProps<Props> = Props & {
  message: string | null,
};

type In<Props> = React$ComponentType<Props>;
type Out<Props> = React$ComponentType<AugmentedProps<Props>>;


// ----- Component ----- //

function withError<Props: { id: string }>(Component: In<Props>): Out<Props> {
  return ({ message, ...props }: AugmentedProps<Props>) => (
    <div>
      <Component {...props} />
      {message ? <label className="component-error" htmlFor={props.id}>{message}</label> : null}
    </div>
  );
}


// ----- Exports ----- //

export { withError };
