// @flow

// ----- Imports ----- //

import React from 'react';

import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';


// ----- Component ----- //

function withArrow<Props: { children: React$Node }>(Component: React$ComponentType<Props>): React$ComponentType<Props> {

  return ({ children, ...otherProps }: Props) => (
    <div className="component-with-arrow">
      <Component {...otherProps}>
        {children}
        <SvgArrowRightStraight />
      </Component>
    </div>
  );

}


// ----- Exports ----- //

export { withArrow };
