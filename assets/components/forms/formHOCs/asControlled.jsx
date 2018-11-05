// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Types ----- //

type InitialProps<V> = {
  value: V,
};

type AugmentedProps<Props> = Props & {
  setValue: string => void,
};

type In<Props> = React$ComponentType<Props>;
type Out<Props> = React$ComponentType<AugmentedProps<Props>>;


// ----- Component ----- //

function asControlled<V, Props: InitialProps<V>>(Component: In<Props>): Out<Props> {
  return ({ setValue, ...props }) => (
    <Component {...props} onChange={e => setValue(e.target.value)} />
  );
}


// ----- Exports ----- //

export { asControlled };
