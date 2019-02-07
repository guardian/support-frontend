// @flow

// ----- Imports ----- //

import React from 'react';

import { Label, type PropsForHoc } from '../standardFields/label';

// ----- Types ----- //

type AugmentedProps<Props> = Props & PropsForHoc;

type In<Props> = React$ComponentType<Props>;
type Out<Props> = React$ComponentType<AugmentedProps<Props>>;


// ----- Component ----- //

function withLabel<Props: { id: string }>(Component: In<Props>): Out<Props> {
  return ({ label, ...props }: AugmentedProps<Props>) => (
    <Label htmlFor={props.id} label={label}>
      <Component {...props} />
    </Label>
  );
}


// ----- Exports ----- //

export { withLabel };
