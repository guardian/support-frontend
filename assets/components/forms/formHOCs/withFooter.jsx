// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import './withFooter.scss';

// ----- Types ----- //

type AugmentedProps<Props> = Props & {
  footer: Node,
};

type In<Props> = React$ComponentType<Props>;
type Out<Props> = React$ComponentType<AugmentedProps<Props>>;


// ----- Component ----- //

function withFooter<Props: { id: string }>(Component: In<Props>): Out<Props> {
  return ({ footer, ...props }: AugmentedProps<Props>) => (
    <div>
      <Component {...props} />
      <div className="component-form-footer">
        {footer}
      </div>
    </div>
  );
}


// ----- Exports ----- //

export { withFooter };
