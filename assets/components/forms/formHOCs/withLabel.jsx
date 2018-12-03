// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Types ----- //

type AugmentedProps<Props> = Props & {
  label: string,
};

type In<Props> = React$ComponentType<Props>;
type Out<Props> = React$ComponentType<AugmentedProps<Props>>;


// ----- Component ----- //

function withLabel<Props: { id: string }>(Component: In<Props>): Out<Props> {
  return ({ label, ...props }: AugmentedProps<Props>) => (
    <div>
      <label className="component-label" htmlFor={props.id}>{label}</label>
      <Component {...props} />
    </div>
  );
}


// ----- Exports ----- //

export { withLabel };
