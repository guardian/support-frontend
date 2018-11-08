// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Types ----- //

type InitialProps<V> = {
  value: V,
};

type AugmentedProps<Props, Action> = Props & {
  setValue: string => Action,
};

type In<Props> = React$ComponentType<Props>;
type Out<Props, A> = React$ComponentType<AugmentedProps<Props, A>>;


// ----- Component ----- //

function asControlled<V, A, Props: InitialProps<V>>(Component: In<Props>): Out<Props, A> {
  return ({ setValue, ...props }) => (
    <Component {...props} onChange={e => setValue(e.target.value)} />
  );
}


// ----- Exports ----- //

export { asControlled };
