// @flow

// ----- Imports ----- //

import React from 'react';

import { type Option } from 'helpers/types/option';
import { Validated, type PropsForHoc } from 'components/forms/customFields/validated';

// ----- Types ----- //

type AugmentedProps<Props> = Props & PropsForHoc;

type In<Props> = React$ComponentType<Props>;
type Out<Props> = React$ComponentType<AugmentedProps<Props>>;


// ----- Component ----- //

function withValidation<Props: { id: Option<string> }>(Component: In<Props>): Out<Props> {

  return ({ valid, ...props }: AugmentedProps<Props>) => (
    <Validated htmlFor={props.id} valid={valid}>
      <Component {...props} />
    </Validated>
  );

}


// ----- Exports ----- //

export { withValidation };
