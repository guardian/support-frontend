// @flow

// ----- Imports ----- //

import React from 'react';

import { Label, type PropsForHoc } from 'components/forms/label';
import { type Option } from 'helpers/types/option';

// ----- Types ----- //

type AugmentedProps<Props> = Props & PropsForHoc;

type In<Props> = React$ComponentType<Props>;
type Out<Props> = React$ComponentType<AugmentedProps<Props>>;

// ----- Component ----- //

function withLabel<Props: { id: Option<string> }>(Component: In<Props>): Out<Props> {
  return ({
    label, optional, footer, ...props
  }: AugmentedProps<Props>) => (
    <Label htmlFor={props.id} footer={footer} label={label} optional={optional}>
      <Component {...props} />
    </Label>
  );
}

// ----- Exports ----- //

export { withLabel };
